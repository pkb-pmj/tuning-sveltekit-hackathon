import { expect, test } from 'vitest';
import { Interval } from './interval';
import { Node } from './intervalTree';

test('flat', () => {
	const root = new Node(new Interval(1), null);
	root.addChild(new Interval('3/2'));
	root.addChild(new Interval('4/3'));
	root.addChild(new Interval('2/3'));
	const expected = ['2/3', '1', '4/3', '3/2'].map((frac) => new Interval(frac));
	expect(root.sorted.map((node) => node.absInterval())).toEqual(expected);
});
