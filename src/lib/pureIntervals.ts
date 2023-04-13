import type Fraction from 'fraction.js';
import { Interval } from './interval';

export interface PureInterval {
	name: string;
	value: Interval;
}

export interface Comma extends PureInterval {
	diff: Fraction;
}

export function closestInterval(interval: Interval, list: PureInterval[]): PureInterval {
	const thisValue = interval.log2valueOf();
	const sorted = list
		.map(({ name, value }) => ({
			name,
			value,
			diff: Math.abs(value.log2valueOf() - thisValue),
		}))
		.sort((a, b) => a.diff - b.diff);
	return sorted[0];
}

export function mostSimilarInterval(interval: Interval, list: PureInterval[]): Comma | null {
	const sorted = list
		.map(({ name, value }) => ({ name, value, diff: interval.divide(value) }))
		.filter((comma): comma is Comma => comma.diff !== null)
		.sort((a, b) => a.diff.sub(b.diff).valueOf());
	return sorted[0] ?? null;
}

export const pureIntervals: PureInterval[] = [
	{ name: 'Unison', value: new Interval('1') },
	{ name: 'Minor Second', value: new Interval('16/15') },
	{ name: 'Major Second', value: new Interval('9/8') },
	{ name: 'Minor Third', value: new Interval('6/5') },
	{ name: 'Major Third', value: new Interval('5/4') },
	{ name: 'Perfect Fourth', value: new Interval('4/3') },
	{ name: 'Tritone', value: new Interval('45/32') },
	{ name: 'Diminished Fifth', value: new Interval('64/45') },
	{ name: 'Perfect Fifth', value: new Interval('3/2') },
	{ name: 'Minor Sixth', value: new Interval('8/5') },
	{ name: 'Major Sixth', value: new Interval('5/3') },
	{ name: 'Minor Seventh', value: new Interval('16/9') },
	{ name: 'Major Seventh', value: new Interval('15/8') },
	{ name: 'Octave', value: new Interval('2') },
];

export const commasAndSchismas: PureInterval[] = [
	{ name: 'Pythagorean Comma', value: new Interval('531441/524288') },
	{ name: 'Syntonic Comma', value: new Interval('81/80') },
	{ name: 'Septimal Comma', value: new Interval('64/63') },
	{ name: 'Greater Diesis', value: new Interval('256/243') },
	{ name: 'Lesser Diesis', value: new Interval('128/125') },
	{ name: 'Schisma', value: new Interval('32805/32768') },
	// { name: 'Hemithirds Comma', value: new Interval('32/31') },
	{ name: 'Porcupine Comma', value: new Interval('4375/4374') },
	{ name: 'Magic Comma', value: new Interval('225/224') },
	{ name: 'Bohlen-Pierce Comma', value: new Interval('243/242') },
];

export function closestPureInterval(interval: Interval): PureInterval {
	return closestInterval(interval, pureIntervals);
}

export function closestComma(interval: Interval): PureInterval {
	return closestInterval(interval, commasAndSchismas);
}

export function mostSimilarComma(interval: Interval): Comma | null {
	return mostSimilarInterval(interval, commasAndSchismas);
}

export function splitIntoPureAndComma(interval: Interval) {
	const pureSign = Math.sign(interval.log2valueOf());
	interval = interval.abs();

	const pure = closestPureInterval(interval);
	const remainder = interval.sub(pure.value);
	const commaSign = Math.sign(remainder.log2valueOf());
	let comma = mostSimilarComma(remainder);

	pure.value = pure.value.mul(pureSign);
	if (comma) comma.value = comma.value.mul(commaSign);

	return { pure, remainder, comma };
}
