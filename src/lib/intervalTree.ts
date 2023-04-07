import { writable, type Readable } from 'svelte/store';
import { Interval } from './interval';

export interface Node {
	readonly children: Node[];
	readonly relInterval: Interval;
	readonly absInterval: Interval;
	readonly index: number;
	addChild(interval: Interval): Node;
	removeSelf(): void;
	setInterval(interval: Interval): void;
}

export const cmp = (a: Node, b: Node) => a.absInterval.log2valueOf() - b.absInterval.log2valueOf();

export function intervalTree(): Readable<Node[]> {
	class NodeClass implements Node {
		relInterval: Interval;
		absInterval!: Interval;
		private parent: NodeClass | null;
		children: NodeClass[] = [];
		index: number = 0;

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
			updateTree();
			return child;
		}

		removeSelf() {
			if (!this.parent) throw new Error("can't remove the root node");
			const index = this.parent.children.indexOf(this);
			if (index === -1) throw new Error("didn't find self in parent's children");
			this.parent.children.splice(index, 1);
			const toRemove = this.traverseBreadthFirst();
			nodes = nodes.filter((node) => !toRemove.includes(node));
			updateTree();
		}

		setInterval(interval: Interval) {
			this.relInterval = interval;
			this.parent?.children.sort(cmp);
			this.traverseBreadthFirst((node) => node.updateAbsoluteInterval());
			updateTree();
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
	}

	const root = new NodeClass();

	function updateTree() {
		let index = 0;
		root.traverseDepthFirst((node) => {
			node.index = index++;
		});
		set(nodes);
	}

	let nodes = [root];
	const { set, subscribe } = writable(nodes);

	return { subscribe };
}
