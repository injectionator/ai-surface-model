#!/usr/bin/env node
import {createInterface} from 'node:readline/promises';
import {overview} from './startup.js';

if (process.argv.length !== 2) {
  console.log('Only bare startup is implemented in this experimental build. Run n8r-surface with no arguments.');
  process.exitCode = 2;
} else {
  const state = overview();
  console.log(state.text);
  console.log('Setup and AI conversation are not implemented in this build. Research needs a supported AI runner.');
  process.exitCode = state.failed ? 2 : 1;
  if (state.configured && !state.failed && process.stdin.isTTY && process.stdout.isTTY) {
    const input = createInterface({input: process.stdin, output: process.stdout});
    try {
      const answer = await input.question('Show setup requirements? [y/N] ');
      if (/^y(es)?$/i.test(answer.trim())) {
        console.log('Research will require an explicitly selected runner, model and external credential reference. A Lab connection is optional. No settings have been changed.');
      }
    } catch {
      // EOF/Ctrl-C cancels guidance; the read-only overview has already printed.
    } finally {
      input.close();
    }
  } else if (!state.failed) {
    console.log('Run in an interactive terminal for read-only setup guidance.');
  }
}
