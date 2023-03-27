import { expect, test } from 'vitest';
import { Interval } from './interval';

test('interval constructor', () => {
	const interval = new Interval([[2, 1]]);
	expect(interval.valueOf()).toStrictEqual(2);
});

test.each([
	[1.5, [3, 1], [2, -1]], // perfect fifth
	[2.25, [5, 1], [4, -1]], // just major third
	[1.4953487812, [5, 1, 4]], // 1/4 comma meantone fifth
])('interval valueOf', (expected, ...factors) => {
	const interval = new Interval(factors as any);
	expect(interval.valueOf()).toBeCloseTo(expected, 10);
});
