import Fraction from 'fraction.js';

export const primes = [2, 3, 5, 7, 11, 13, 17, 19];

export function factorizeFraction(fraction: Fraction): Fraction[] {
	let { n, d } = fraction;
	const factors = primes.map((prime) => {
		let i = 0;

		while (n % prime === 0) {
			n /= prime;
			i++;
		}
		if (i > 0) return new Fraction(i);

		while (d % prime === 0) {
			d /= prime;
			i++;
		}
		if (i > 0) return new Fraction(-i);

		return new Fraction(0);
	});

	if (n !== 1 || d !== 1) throw new RangeError('too big prime factors');

	return factors;
}

export class Interval {
	private factors: Fraction[];

	constructor(fraction: Fraction);
	constructor(factors: Fraction[]);
	constructor(args: Fraction[] | Fraction) {
		if (Array.isArray(args)) {
			this.factors = args;
			while (this.factors.length < primes.length) {
				this.factors.push(new Fraction(0));
			}
		} else {
			this.factors = factorizeFraction(args);
		}
	}

	valueOf(): number {
		return this.factors.reduce((acc, exp, i) => acc * primes[i] ** exp.valueOf(), 1);
	}

	add(other: Interval): Interval {
		return this;
	}

	sub(other: Interval): Interval {
		return this;
	}

	mult(value: number): Interval {
		return this;
	}

	div(value: number): Interval {
		return this;
	}
}
