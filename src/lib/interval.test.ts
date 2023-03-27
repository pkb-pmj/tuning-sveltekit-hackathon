import { it, expect } from 'vitest';
import { Interval } from './interval';
import Fraction from 'fraction.js';

it('creates an interval', () => {
	const interval = new Interval([{ base: 2, exp: new Fraction(1) }]);

	expect(interval.valueOf()).toStrictEqual(2);
});
