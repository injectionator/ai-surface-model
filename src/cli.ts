#!/usr/bin/env node
import {createInterface} from 'node:readline';
import {overview} from './startup.js';
import {chooseVault, inspectVault, saveSetup} from './setup.js';
import {line, problem, type Settings} from './settings.js';

async function setup(config: Settings): Promise<number> {
  const existing = config.vault === undefined ? undefined : inspectVault(config.vault);
  if (existing && !existing.missing) {
    console.log(`Vault ready: ${line(existing.root)}`);
    return 0;
  }
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    console.log('Vault setup required; run n8r-surface in an interactive terminal.');
    return 1;
  }
  const input = createInterface({input: process.stdin, output: process.stdout});
  let closed = false;
  input.once('close', () => { closed = true; });
  const cancel = () => input.close();
  input.on('SIGINT', cancel);
  process.on('SIGINT', cancel);
  const ask = (prompt: string): Promise<string | undefined> => new Promise(resolve => {
    if (closed) { resolve(undefined); return; }
    const ended = () => resolve(undefined);
    input.once('close', ended);
    input.question(prompt, answer => {
      input.removeListener('close', ended);
      resolve(answer);
    });
  });
  try {
    let vault = existing?.root;
    if (vault === undefined) {
      const answer = await ask('Vault directory [~/n8r/]: ');
      if (answer === undefined) return 1;
      vault = chooseVault(answer === '' ? '~/n8r/' : answer, config.home, process.cwd());
      inspectVault(vault);
    }
    console.log(`Vault directory: ${line(vault)}`);
    if (existing) console.log('Required vault folders are missing; confirmation will create them.');
    const answer = await ask('Create vault folders and save this location? [y/N] ');
    if (answer === undefined || !/^y(es)?$/i.test(answer.trim())) return 1;
    const saved = saveSetup(config, vault, process.cwd());
    console.log(`Vault ready: ${line(saved)}`);
    return 0;
  } finally {
    input.close();
    process.removeListener('SIGINT', cancel);
  }
}

if (process.argv.length !== 2) {
  console.log('Only bare startup is implemented in this experimental build. Run n8r-surface with no arguments.');
  process.exitCode = 2;
} else {
  const state = overview();
  console.log(state.text);
  console.log('AI research is not implemented in this build. Setup does not start research.');
  if (state.failed || !state.settings) process.exitCode = 2;
  else {
    try { process.exitCode = await setup(state.settings); }
    catch (error) {
      console.log(`Vault setup failed: ${problem(error)}`);
      process.exitCode = 2;
    }
  }
}
