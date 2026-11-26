import { describe, expect, it } from 'vitest';
import { ensembles, events } from '../../src/lib/data';

describe('data files', () => {
  it('afisha.json is valid and has no sample events', () => {
    expect(Array.isArray(events)).toBe(true);
    expect(events.some((e) => e.sample)).toBe(false);
  });
  it('ensembles.json lists the eight ensembles in order', () => {
    expect(ensembles.map((e) => e.id)).toEqual(['omarov', 'symph', 'jazz', 'choir', 'nur', 'shernyaz', 'lad', 'retro']);
  });
});
