import { Interval } from './interval';

export interface NamedInterval {
	name: string;
	value: Interval;
}

export function closestNamedInterval(interval: Interval, list: NamedInterval[]): NamedInterval {
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

export const pureIntervals: NamedInterval[] = [
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
	// { name: 'Octave', value: new Interval('2') },
];

export const commasAndSchismas = [
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

export function closestPureInterval(interval: Interval) {
	return closestNamedInterval(interval, pureIntervals);
}

export function closestCommaOrSchisma(interval: Interval) {
	return closestNamedInterval(interval, commasAndSchismas);
}

export function splitIntoPureAndComma(interval: Interval): [NamedInterval, NamedInterval] {
	const sign = Math.sign(interval.log2valueOf());
	interval = interval.abs();

	const pure = closestPureInterval(interval);
	const remainder = interval.sub(pure.value);
	let comma = closestCommaOrSchisma(interval);

	if (remainder.sub(comma.value).log2valueOf() !== 0) {
		comma.value = remainder;
		comma.name = 'Unknown comma';
	}

	pure.value = pure.value.mul(sign);
	comma.value = comma.value.mul(sign);

	return [pure, comma];
}
