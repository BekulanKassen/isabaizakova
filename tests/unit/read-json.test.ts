import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readJson } from '../../src/lib/data';

describe('readJson', () => {
  it('names the file and the line of a syntax error', () => {
    const dir = mkdtempSync(join(tmpdir(), 'afisha-'));
    const f = join(dir, 'afisha.json');
    writeFileSync(f, '[\n  {"id": "a"},\n]\n');
    expect(() => readJson(f)).toThrow(/Ошибка в .*afisha\.json.*строка 3/s);
  });
  it('reads valid JSON', () => {
    const dir = mkdtempSync(join(tmpdir(), 'afisha-'));
    const f = join(dir, 'ok.json');
    writeFileSync(f, '[]');
    expect(readJson(f)).toEqual([]);
  });
});
