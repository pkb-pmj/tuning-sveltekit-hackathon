import { expect, test } from 'vitest';
import { factorizeFraction, Interval, primes } from './interval';
import Fraction from 'fraction.js';

test.each([
	[
		'3/2',
		[
			[3, 1],
			[2, -1],
		],
	],
	[
		'5/4',
		[
			[5, 1],
			[2, -2],
		],
	],
])('factorize fraction', (input, output) => {
	const factors = factorizeFraction(new Fraction(input));
	for (const [prime, fraction] of output) {
		expect(factors[primes.indexOf(prime)]).toEqual(new Fraction(fraction));
	}
});

test.each([
	['3/2', 1.5], // perfect fifth
	['5/4', 1.25], // just major third
	// [1.4953487812, [5, 1, 4]], // 1/4 comma meantone fifth
])('interval valueOf', (input, output) => {
	const interval = new Interval(new Fraction(input));
	expect(interval.valueOf()).toBeCloseTo(output, 10);
});
