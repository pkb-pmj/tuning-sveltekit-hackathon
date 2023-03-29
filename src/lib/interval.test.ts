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

const cases = [
	['3/2', '3/2', 'perfect fifth'],
	['3', '3/2', 'octave + perfect fifth'],
	['5/4', '5/4', 'perfect major third'],
	['5', '5/4', 'two octaves + perfect major third'],
	['2', '1', 'octave'],
	['4', '1', 'two octaves'],
	['1/2', '1', 'reversed octave'],
	['1/4', '1', 'reversed two octaves'],
	['2/3', '2/3', 'reversed perfect fifth'],
	['1/3', '2/3', 'reversed octave + perfect fifth'],
	['1/5', '4/5', 'reversed two octaves + perfect major third'],
];

test.each(cases)('log2valueOf %s -> %s (%s)', (input, output, desc) => {
	const interval = new Interval(new Fraction(input));
	expect(interval.log2valueOf(), desc).toBeCloseTo(Math.log2(new Fraction(output).valueOf()), 10);
});

test.each(cases)('auto normalize %s -> %s (%s)', (input, output, desc) => {
	const interval = new Interval(new Fraction(input));
	expect(interval.valueOf(), desc).toBeCloseTo(new Fraction(output).valueOf(), 10);
});
