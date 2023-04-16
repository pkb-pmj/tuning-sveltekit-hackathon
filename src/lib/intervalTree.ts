import { writable, type Readable } from 'svelte/store';
import { Interval } from './interval';

export interface Node {
	readonly parent: Node | null;
	readonly children: Node[];
	readonly relInterval: Interval;
	readonly absInterval: Interval;
	readonly index: number;
	readonly numDescendants: number;
	addChild(interval: Interval): Node;
	removeSelf(): void;
	setInterval(interval: Interval): void;
	pathTo(other: Node): Node[];
	toJSON(): IntervalTreeJSON;
	addFromJSON(json: IntervalTreeJSON): void;
}

export interface IntervalTreeJSON {
	[K: string]: IntervalTreeJSON;
}

export interface IntervalTree extends Readable<Node[]> {
	update: () => void;
}

export const cmp = (a: Node, b: Node) => a.absInterval.log2valueOf() - b.absInterval.log2valueOf();

export function intervalTree(): IntervalTree {
	class NodeClass implements Node {
		relInterval: Interval;
		absInterval!: Interval;
		parent: NodeClass | null;
		children: NodeClass[] = [];
		index: number = 0;
		numDescendants: number = 0;

		constructor(parent: NodeClass | null = null, interval: Interval = new Interval(1)) {
			this.relInterval = interval;
			this.parent = parent;
			this.updateAbsoluteInterval();
		}

		addChild(interval: Interval): NodeClass {
			const child = new NodeClass(this, interval);
			this.children.push(child);
			this.children.sort(cmp);
			nodes.push(child);
			return child;
		}

		removeSelf() {
			if (!this.parent) return console.warn("can't remove the root node");
			const index = this.parent.children.indexOf(this);
			if (index === -1) console.warn("didn't find self in parent's children");
			else this.parent.children.splice(index, 1);
			const toRemove = this.traverseBreadthFirst();
			nodes = nodes.filter((node) => !toRemove.includes(node));
		}

		setInterval(interval: Interval) {
			this.relInterval = interval;
			this.parent?.children.sort(cmp);
			this.traverseBreadthFirst((node) => node.updateAbsoluteInterval());
		}

		private updateAbsoluteInterval() {
			this.absInterval = this.parent?.absInterval.add(this.relInterval) ?? this.relInterval;
		}

		traverseBreadthFirst(fn?: (node: NodeClass) => void): NodeClass[] {
			const nodes: NodeClass[] = [];
			const queue: NodeClass[] = [this];
			while (queue.length > 0) {
				const node = queue.shift()!;
				nodes.push(node);
				node.children.forEach((child) => queue.push(child));
			}
			if (fn) nodes.forEach(fn);
			return nodes;
		}

		traverseDepthFirst(fn: (node: NodeClass) => void) {
			fn(this);
			this.children.forEach((child) => child.traverseDepthFirst(fn));
		}

		traverseDepthFirstReverse(fn: (node: NodeClass) => void) {
			this.children.forEach((child) => child.traverseDepthFirstReverse(fn));
			fn(this);
		}

		ancestorsInclusive(): NodeClass[] {
			const nodes: NodeClass[] = [];
			let node: NodeClass | null = this;
			while (node) {
				nodes.push(node);
				node = node.parent;
			}
			return nodes;
		}

		pathTo(other: NodeClass): NodeClass[] {
			const thisAncestors = this.ancestorsInclusive();
			const otherAncestors = other.ancestorsInclusive();
			const thisIndex = thisAncestors.findLastIndex((node) => otherAncestors.includes(node));
			const otherIndex = otherAncestors.indexOf(thisAncestors[thisIndex]);
			return thisAncestors
				.slice(0, thisIndex + 1)
				.concat(otherAncestors.slice(0, otherIndex).reverse());
		}

		toJSON(): IntervalTreeJSON {
			return Object.fromEntries(
				this.children.map((child) => [child.relInterval.toString(), child.toJSON()]),
			);
		}

		addFromJSON(json: IntervalTreeJSON) {
			for (const str in json) {
				this.addChild(Interval.fromString(str)).addFromJSON(json[str]);
			}
		}
	}

	const root = new NodeClass();

	function update() {
		let index = 0;
		root.traverseDepthFirst((node) => {
			node.index = index++;
		});
		root.traverseDepthFirstReverse((node) => {
			node.numDescendants = node.children.reduce((acc, curr) => acc + curr.numDescendants + 1, 0);
		});
		set(nodes);
	}

	let nodes = [root];
	const { set, subscribe } = writable(nodes);

	return { subscribe, update };
}
