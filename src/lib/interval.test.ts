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
	const interval = new Interval(input).normalized();
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
	['8/9', '8/9', 'keeping the direction'],
	['16/9', '16/9', 'keeping the direction'],
	['5/9', '5/9', 'keeping the direction'],
	['10/9', '10/9', 'keeping the direction'],
];

test.each(cases)('log2valueOf %s -> %s (%s)', (input, output, desc) => {
	const interval = new Interval(input).normalized();
	expect(interval.log2valueOf(), desc).toBeCloseTo(Math.log2(new Fraction(output).valueOf()), 10);
});

test.each(cases)('auto normalize %s -> %s (%s)', (input, output, desc) => {
	const interval = new Interval(input).normalized();
	expect(interval.valueOf(), desc).toBeCloseTo(new Fraction(output).valueOf(), 10);
});

test.each([
	['3/2', '3/2', '9/8'],
	['3/2', '4/3', '1'],
	['3/2', '2/3', '1'],
	['2/3', '2/3', '8/9'],
	['3/2', '3/4', '9/8'],
	['2/3', '4/3', '8/9'],
	['4/3', '2/3', '8/9'],
	['5/3', '2/3', '10/9'],
])('add %s + %s -> %s', (input1, input2, output) => {
	const interval1 = new Interval(input1).normalized();
	const interval2 = new Interval(input2).normalized();
	const actual = interval1.add(interval2).normalized();
	const expected = new Interval(output).normalized();
	expect(actual.valueOf()).toBeCloseTo(expected.valueOf(), 10);
});

test.each([
	['3/2', '3/2', '1'],
	['2/3', '4/3', '1'],
	['3/2', '4/3', '9/8'],
	['3/2', '2/3', '9/8'],
	['4/3', '3/2', '8/9'],
	['2/3', '3/4', '8/9'],
	['3/4', '2/3', '9/8'],
	['5/3', '2/3', '5/4'],
])('sub %s - %s -> %s', (input1, input2, output) => {
	const interval1 = new Interval(input1).normalized();
	const interval2 = new Interval(input2).normalized();
	const actual = interval1.sub(interval2).normalized();
	const expected = new Interval(output).normalized();
	expect(actual.valueOf()).toBeCloseTo(expected.valueOf(), 10);
});

test.each([
	['3/2', 2, (3 / 2) ** 2 / 2],
	['3/2', 4, (3 / 2) ** 4 / 4],
	['2/3', 3, (2 / 3) ** 3 * 2],
	['2/3', 4, (2 / 3) ** 4 * 4],
	['2', 2, 1],
	['1/2', 2, 1],
])('mult %s * %d', (frac, div, expected) => {
	const interval1 = new Interval(frac).normalized();
	const actual = interval1.mul(div).normalized();
	expect(actual.valueOf()).toBeCloseTo(expected, 10);
});

test.each([
	['3/2', 2, (3 / 2) ** (1 / 2)],
	['3/2', 4, (3 / 2) ** (1 / 4)],
	['2/3', 3, (2 / 3) ** (1 / 3)],
	['2/3', 4, (2 / 3) ** (1 / 4)],
	['2', 2, 1],
	['1/2', 2, 1],
])('div %s / %d', (frac, div, expected) => {
	const interval1 = new Interval(frac).normalized();
	const actual = interval1.div(div).normalized();
	expect(actual.valueOf()).toBeCloseTo(expected, 10);
});
