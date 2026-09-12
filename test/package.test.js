import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Packaging - Pi loads the TypeScript source extension entrypoint', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.deepEqual(packageJson.pi.extensions, ['./src/index.ts']);
  assert.ok(packageJson.files.includes('src'));
});
