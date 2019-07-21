import { mergeMaps } from './util';

describe('util', () => {
  test('mergeMaps', () => {
    const m1 = new Map<string, number>(
      Object.entries({ a: 1, b: 2 })
    );

    const m2 = new Map<string, number>(
      Object.entries({ b: 20, c: 3, d: 4 })
    );

    const actual = mergeMaps<string, number>(m1, m2);

    const expected = new Map<string,number>(
      Object.entries({ a:1, b: 20, c: 3, d: 4 })
    );

    expect(actual).toEqual(expected);
  });
});
