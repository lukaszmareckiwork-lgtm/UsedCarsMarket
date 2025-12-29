import { clamp } from './math';

describe('clamp', () => {
  test('returns value when within the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  test('returns min when value is below min', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  test('returns max when value is above max', () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });
});
