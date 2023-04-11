import Fraction from 'fraction.js';

export const primes = [2, 3, 5, 7, 11, 13, 17, 19];
const logOfPrimes = primes.map((prime) => Math.log2(prime));

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
	constructor(num: number | string);
	constructor(numerator: number, denominator: number);
	constructor(factors: Fraction[]);
	constructor(first: Fraction[] | Fraction | number | string, second?: number) {
		if (Array.isArray(first)) {
			this.factors = [...first];
			while (this.factors.length < primes.length) {
				this.factors.push(new Fraction(0));
			}
		} else {
			this.factors = factorizeFraction(new Fraction(first, second));
		}
	}

	valueOf(): number {
		return this.factors.reduce((acc, exp, i) => acc * primes[i] ** exp.valueOf(), 1);
	}

	log2valueOf(): number {
		return this.factors.reduce((acc, exp, i) => acc + logOfPrimes[i] * exp.valueOf(), 0);
	}

	abs(): Interval {
		const logSum = this.log2valueOf();
		if (logSum >= 0) {
			return new Interval(this.factors);
		} else {
			return new Interval(this.factors.map((val) => val.neg()));
		}
	}

	modUnsigned(): Interval {
		let logSum = this.log2valueOf();
		logSum = Math.floor(logSum);
		const interval = new Interval(this.factors);
		interval.factors[0] = interval.factors[0].sub(logSum);
		return interval;
	}

	modSigned(): Interval {
		let logSum = this.log2valueOf();
		logSum = Math.floor(Math.abs(logSum)) * Math.sign(logSum);
		const interval = new Interval(this.factors);
		interval.factors[0] = interval.factors[0].sub(logSum);
		return interval;
	}

	add(other: Interval): Interval {
		return new Interval(this.factors.map((exp, i) => exp.add(other.factors[i])));
	}

	sub(other: Interval): Interval {
		return new Interval(this.factors.map((exp, i) => exp.sub(other.factors[i])));
	}

	mul(value: number): Interval {
		return new Interval(this.factors.map((exp) => exp.mul(value)));
	}

	div(value: number): Interval {
		return new Interval(this.factors.map((exp) => exp.div(value)));
	}

	frac(): string {
		const whole: [number, number][] = this.factors.map((exp, i) => [
			exp.abs().floor().valueOf() * exp.s,
			i,
		]);
		const frac: [Fraction, number][] = this.factors.map((exp, i) => [exp.mod(1), i]);

		const numWhole = whole
			.filter(([exp]) => exp > 0)
			.reduce((acc, [exp, i]) => acc * primes[i] ** exp, 1);

		const denWhole = whole
			.filter(([exp]) => exp < 0)
			.reduce((acc, [exp, i]) => acc * primes[i] ** -exp, 1);

		const wholeFrac = new Fraction(numWhole, denWhole);

		const fractional = frac
			.filter(([exp, _]) => !exp.equals(0))
			.map(([exp, i]) => `${primes[i]}^${exp.toFraction()}`);

		return [wholeFrac.toFraction(), ...fractional].join('*');
	}

	cents(): number {
		return this.log2valueOf() * 1200;
	}

	toString(): string {
		return this.factors
			.filter((exp) => !exp.equals(0)) // filtering changes indexes!
			.map((exp, i) => `${primes[i]}^${exp.toFraction()}`)
			.join('*');
	}

	clone(): Interval {
		return structuredClone(this);
	}

	mathML(): MathML {
		const rational = this.factors
			.map((exp, i) => ({ exp: exp.abs().floor().n * exp.s, base: primes[i] }))
			.reduce((acc, { exp, base }) => {
				return exp > 0 ? acc.mul(base ** exp) : exp < 0 ? acc.div(base ** -exp) : acc;
			}, new Fraction(1));

		const irrational = this.factors
			.map((exp, i) => ({ exp: exp.mod(1), base: primes[i] }))
			.filter(({ exp }) => !exp.equals(0));

		return { rational, irrational };
	}
}

interface MathML {
	rational: Fraction;
	irrational: {
		base: number;
		exp: Fraction;
	}[];
}
