"""Offline integration tests: real Git repositories, a stub for GitHub only."""

import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


FLOW = Path(__file__).resolve().parents[1] / "scripts" / "flow"


class FlowTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="surface-flow-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.repo = self.root / "checkout"
        self.remote = self.root / "origin.git"
        self.bin = self.root / "bin"
        self.repo.mkdir()
        self.bin.mkdir()
        self.branch = "chore/123-example"
        # Keep user Git configuration, hooks and credentials out of the fixtures.
        self.env = {key: value for key, value in os.environ.items()
                    if not key.startswith(("GIT_", "GH_"))}
        self.env.update({"GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": os.devnull,
                         "GIT_TERMINAL_PROMPT": "0", "LC_ALL": "C",
                         "PATH": f"{self.bin}{os.pathsep}{os.environ['PATH']}",
                         "GH_REPO": "example/wrong-repository"})
        self.git("init", "--bare", str(self.remote))
        self.git("init", "-b", "main")
        self.git("config", "user.name", "Flow Test")
        self.git("config", "user.email", "flow@example.test")
        self.git("config", "core.hooksPath", os.devnull)
        (self.repo / "README.md").write_text("base\n")
        self.git("add", ".")
        self.git("commit", "-m", "base")
        self.base = self.git("rev-parse", "HEAD")
        self.git("remote", "add", "origin", str(self.remote))
        self.git("push", "-u", "origin", "main")
        self.git("switch", "-c", self.branch)
        (self.repo / "feature.txt").write_text("feature\n")
        self.git("add", ".")
        self.git("commit", "-m", "feature")
        self.head = self.git("rev-parse", "HEAD")
        self.git("push", "-u", "origin", self.branch)
        self.git("branch", "docs/124-unrelated")
        self.metadata = {
            "number": 123, "state": "MERGED", "isDraft": False,
            "headRefName": self.branch, "headRefOid": self.head,
            "baseRefName": "main", "isCrossRepository": False,
            "mergeCommit": {"oid": self.base},
            "url": "https://github.example/example/model/pull/123",
        }
        self.response = self.root / "pr.json"
        self.env["FLOW_TEST_RESPONSE"] = str(self.response)
        self.env["FLOW_TEST_ORIGIN"] = str(self.remote)
        stub = self.bin / "gh"
        stub.write_text(f"#!{sys.executable}\n" + '''
import json, os, sys
args = sys.argv[1:]
if os.environ.get("FLOW_TEST_GH_FAIL"):
    sys.exit(1)
if args[:3] != ["pr", "view", "chore/123-example"]:
    sys.exit(64)
if "--repo" not in args or args[args.index("--repo") + 1] != os.environ["FLOW_TEST_ORIGIN"]:
    sys.exit(64)
if "--json" not in args or "--jq" not in args:
    sys.exit(64)
with open(os.environ["FLOW_TEST_RESPONSE"]) as stream:
    data = json.load(stream)
values = [data[key] for key in ("number", "state", "isDraft", "headRefName",
          "headRefOid", "baseRefName", "isCrossRepository")]
values += [data["mergeCommit"]["oid"], data["url"]]
print("|".join(str(value).lower() if isinstance(value, bool) else str(value)
               for value in values))
''')
        stub.chmod(0o755)

    def command(self, *args):
        return subprocess.run(args, cwd=self.repo, env=self.env, text=True,
                              capture_output=True, timeout=20)

    def git(self, *args):
        result = self.command("git", *args)
        self.assertEqual(result.returncode, 0, result.stderr)
        return result.stdout.strip()

    def flow(self, *args):
        self.response.write_text(json.dumps(self.metadata))
        return self.command("bash", str(FLOW), *args)

    def assert_retained(self, result, reason):
        self.assertNotEqual(result.returncode, 0)
        self.assertIn(reason, result.stderr)
        self.assertEqual(self.git("branch", "--show-current"), self.branch)
        self.assertEqual(self.git("rev-parse", self.branch), self.head)
        self.assertEqual(self.git("rev-parse", "main"), self.base)

    def publish_merge(self, squash=True):
        self.git("switch", "main")
        if squash:
            self.git("merge", "--squash", self.branch)
            self.git("commit", "-m", "squash feature")
        else:
            self.git("merge", "--no-ff", self.branch, "-m", "merge feature")
        merged = self.git("rev-parse", "HEAD")
        self.git("push", "origin", "main")
        self.git("switch", self.branch)
        self.git("branch", "-f", "main", self.base)
        self.metadata["mergeCommit"]["oid"] = merged
        return merged

    def assert_cleanup(self, merged):
        result = self.flow("done")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.git("branch", "--show-current"), "main")
        self.assertEqual(self.git("rev-parse", "HEAD"), merged)
        self.assertNotEqual(self.command("git", "show-ref", "--verify",
                                        f"refs/heads/{self.branch}").returncode, 0)
        self.assertEqual(self.git("rev-parse", "docs/124-unrelated"), self.head)
        self.assertIn(self.head, self.git("ls-remote", "origin", f"refs/heads/{self.branch}"))
        self.assertEqual((self.repo / "feature.txt").read_text(), "feature\n")

    def test_squash_merge_updates_main_and_removes_only_completed_local_branch(self):
        merged = self.publish_merge()
        self.assertNotEqual(self.command("git", "merge-base", "--is-ancestor",
                                        self.head, merged).returncode, 0)
        self.assert_cleanup(merged)

    def test_ordinary_merge_updates_main_and_removes_local_branch(self):
        self.assert_cleanup(self.publish_merge(squash=False))

    def test_main_merge_options_cannot_turn_fast_forward_into_squash(self):
        merged = self.publish_merge()
        self.git("config", "branch.main.mergeOptions", "--squash")
        self.assert_cleanup(merged)
        self.assertEqual(self.git("status", "--porcelain"), "")

    def test_rejects_ineligible_or_incomplete_pr_data(self):
        cases = [
            ({"state": "OPEN"}, "not merged"),
            ({"isDraft": True}, "draft"),
            ({"state": "CLOSED"}, "not merged"),
            ({"headRefName": "chore/999-other"}, "head branch"),
            ({"headRefOid": ""}, "head commit"),
            ({"baseRefName": "develop"}, "base"),
            ({"isCrossRepository": True}, "fork"),
            ({"mergeCommit": {"oid": ""}}, "merge commit"),
        ]
        original = dict(self.metadata)
        for changes, reason in cases:
            with self.subTest(changes=changes):
                self.metadata = {**original, **changes}
                self.assert_retained(self.flow("done"), reason)

    def test_retains_new_commits_after_the_pr_head(self):
        self.publish_merge()
        self.git("commit", "--allow-empty", "-m", "new local work")
        self.head = self.git("rev-parse", "HEAD")
        self.assert_retained(self.flow("done"), "head commit")

    def test_retains_branch_when_local_tip_is_behind_pr_head(self):
        self.metadata["headRefOid"] = "f" * 40
        self.assert_retained(self.flow("done"), "head commit")

    def test_retains_unstaged_work(self):
        (self.repo / "feature.txt").write_text("local changes\n")
        self.assert_retained(self.flow("done"), "uncommitted or untracked")
        self.assertEqual((self.repo / "feature.txt").read_text(), "local changes\n")

    def test_retains_staged_work(self):
        (self.repo / "feature.txt").write_text("staged changes\n")
        self.git("add", "feature.txt")
        self.assert_retained(self.flow("done"), "uncommitted or untracked")
        self.assertEqual(self.git("show", ":feature.txt"), "staged changes")

    def test_retains_untracked_files(self):
        (self.repo / "notes.txt").write_text("notes\n")
        self.assert_retained(self.flow("done"), "uncommitted or untracked")
        self.assertEqual((self.repo / "notes.txt").read_text(), "notes\n")

    def test_retains_branch_when_github_lookup_fails(self):
        self.env["FLOW_TEST_GH_FAIL"] = "1"
        self.assert_retained(self.flow("done"), "pull request")

    def test_missing_gh_retains_the_branch(self):
        (self.bin / "gh").unlink()
        (self.bin / "git").symlink_to(shutil.which("git"))
        (self.bin / "bash").symlink_to(shutil.which("bash"))
        self.env["PATH"] = str(self.bin)
        self.assert_retained(self.flow("done"), "GitHub CLI")

    def test_failed_fast_forward_preserves_ignored_file_and_feature_branch(self):
        merged = self.publish_merge()
        self.git("switch", "main")
        self.git("merge", "--ff-only", merged)
        (self.repo / "local.txt").write_text("incoming file\n")
        self.git("add", ".")
        self.git("commit", "-m", "another main change")
        self.git("push", "origin", "main")
        self.git("switch", self.branch)
        self.git("branch", "-f", "main", self.base)
        (self.repo / ".git" / "info" / "exclude").write_text("local.txt\n")
        (self.repo / "local.txt").write_text("local ignored work\n")

        result = self.flow("done")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("failed to fast-forward", result.stderr)
        self.assertEqual(self.git("branch", "--show-current"), "main")
        self.assertEqual(self.git("rev-parse", "main"), self.base)
        self.assertEqual(self.git("rev-parse", self.branch), self.head)
        self.assertEqual((self.repo / "local.txt").read_text(), "local ignored work\n")

    def test_retains_branch_when_fetch_fails(self):
        self.remote.rename(self.root / "unavailable.git")
        self.assert_retained(self.flow("done"), "fetch")

    def test_retains_branch_when_merge_is_not_on_remote_main(self):
        self.metadata["mergeCommit"]["oid"] = self.head
        self.assert_retained(self.flow("done"), "not present on origin/main")

    def test_retains_diverged_local_main(self):
        self.publish_merge()
        self.git("switch", "main")
        self.git("commit", "--allow-empty", "-m", "local main work")
        self.base = self.git("rev-parse", "HEAD")
        self.git("switch", self.branch)
        self.assert_retained(self.flow("done"), "cannot fast-forward")

    def test_refuses_missing_local_main(self):
        self.publish_merge()
        self.git("branch", "-D", "main")
        result = self.flow("done")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("local main", result.stderr)
        self.assertEqual(self.git("branch", "--show-current"), self.branch)
        self.assertEqual(self.git("rev-parse", self.branch), self.head)

    def test_refuses_main_and_detached_head(self):
        for target in ("main", self.head):
            with self.subTest(target=target):
                self.git("checkout", target)
                before = self.git("rev-parse", "HEAD")
                result = self.flow("done")
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("Error:", result.stderr)
                self.assertEqual(self.git("rev-parse", "HEAD"), before)
                self.assertEqual(self.git("rev-parse", self.branch), self.head)

    def test_invalid_arguments_do_not_clean_up(self):
        for args in (("done", "extra"), ("merge",), ("release",), ("typo",)):
            with self.subTest(args=args):
                self.assert_retained(self.flow(*args), "Usage:")

    def test_help_succeeds_without_cleanup(self):
        result = self.flow("help")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("done", result.stdout)
        self.assertEqual(self.git("branch", "--show-current"), self.branch)


if __name__ == "__main__":
    unittest.main()
