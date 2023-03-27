import Fraction from 'fraction.js';

export class Interval {
	private factors: Fraction[] = [];

	constructor(factors: [number, ...ConstructorParameters<typeof Fraction>][]) {
		for (const [base, args] of factors) {
			this.factors[base] = new Fraction(args);
		}
	}

	valueOf(): number {
		return this.factors.reduce((acc, exp, base) => acc * Math.pow(base, exp.valueOf()), 1);
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
