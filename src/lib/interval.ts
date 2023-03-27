import type Fraction from 'fraction.js';

interface Factor {
	base: number;
	exp: Fraction;
}

export class Interval {
	private factors: Factor[] = [];

	constructor(factors: Factor[]) {
		this.factors = factors;
	}

	valueOf(): number {
		return 1;
	}

	add(other: Interval): Interval {
		return new Interval(this.factors);
	}

	sub(other: Interval): Interval {
		return new Interval(this.factors);
	}

	mult(value: number): Interval {
		return new Interval(this.factors);
	}

	div(value: number): Interval {
		return new Interval(this.factors);
	}
}
