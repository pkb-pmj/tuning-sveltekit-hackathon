import { get } from 'svelte/store';
import { expect, test } from 'vitest';
import { Interval } from './interval';
import { intervalTree, type Node } from './intervalTree';

function intervalsFromStrings(fractions: string[]): Interval[] {
	return fractions.map((frac) => new Interval(frac));
}

function intervalsFromNodes(nodes: Node[]): Interval[] {
	return nodes.map((node) => node.absInterval());
}

test('only root', () => {
	const tree = intervalTree();
	const list = get(tree);
	expect(list.length).toStrictEqual(1);
	expect(list[0].absInterval()).toEqual(new Interval(1));
});

test('flat tree', () => {
	const tree = intervalTree();
	let list = get(tree);
	const [root] = list;
	tree.subscribe((value) => (list = value));

	root.addChild(new Interval('3/2'));
	expect(intervalsFromNodes(list)).toEqual(intervalsFromStrings(['1', '3/2']));

	root.addChild(new Interval('4/3'));
	expect(intervalsFromNodes(list)).toEqual(intervalsFromStrings(['1', '4/3', '3/2']));

	root.addChild(new Interval('2/3'));
	expect(intervalsFromNodes(list)).toEqual(intervalsFromStrings(['2/3', '1', '4/3', '3/2']));

	root.addChild(new Interval('3/4'));
	expect(intervalsFromNodes(list)).toEqual(intervalsFromStrings(['2/3', '3/4', '1', '4/3', '3/2']));
});

test('nested tree', () => {
	const tree = intervalTree();
	let list = get(tree);
	const [root] = list;
	tree.subscribe((value) => (list = value));

	root.addChild(new Interval('4/3'));
	expect(intervalsFromNodes(list)).toEqual(intervalsFromStrings(['1', '4/3']));

	const fourth = list[1];
	fourth.addChild(new Interval('5/4'));
	expect(intervalsFromNodes(list)).toEqual(intervalsFromStrings(['1', '4/3', '5/3']));

	root.addChild(new Interval('3/2'));
	expect(intervalsFromNodes(list)).toEqual(intervalsFromStrings(['1', '4/3', '3/2', '5/3']));
});

test('removing from nested tree', () => {
	const tree = intervalTree();
	let list = get(tree);
	const [root] = list;
	tree.subscribe((value) => (list = value));

	root.addChild(new Interval('4/3'));
	const fourth = list[1];
	fourth.addChild(new Interval('5/4'));
	root.addChild(new Interval('3/2'));
	expect(intervalsFromNodes(list)).toEqual(intervalsFromStrings(['1', '4/3', '3/2', '5/3']));

	fourth.removeSelf();
	expect(intervalsFromNodes(list)).toEqual(intervalsFromStrings(['1', '3/2']));
});

test('removing root node', () => {
	const tree = intervalTree();
	let list = get(tree);
	const [root] = list;
	expect(() => root.removeSelf()).toThrow("can't remove the root node");
});
