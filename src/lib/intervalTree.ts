import { writable, type Readable } from 'svelte/store';
import { Interval } from './interval';

export interface Node {
	addChild(interval: Interval): void;
	removeSelf(): void;
	getInterval(): Interval;
	updateInterval(interval: Interval): void;
	absInterval(): Interval;
	readonly id: number;
}

export function intervalTree(): Readable<Node[]> {
	let id = 0;
	const nodes: Node[] = [];

	class Node {
		private interval: Interval;
		private parent: Node | null;
		private children: Node[] = [];
		id = id++;

		constructor(interval: Interval, parent: Node | null) {
			this.interval = interval;
			this.parent = parent;
		}

		addChild(interval: Interval) {
			const child = new Node(interval, this);
			this.children.push(child);
			nodes.push(child);
			set(nodes);
		}

		removeSelf() {
			if (!this.parent) throw new Error("can't remove the root node");
			let index = this.parent.children.indexOf(this);
			if (index === -1) throw new Error("didn't find self in parent's children");
			this.parent!.children.splice(index);

			// TODO: reduce the complexity
			const notes = [];
			const queue: Node[] = [this];
			while (queue.length > 0) {
				const node = queue.shift()!;
				notes.push(node);
				node.children.forEach((child) => queue.push(child));
			}
			notes.forEach((note) => {
				const index = nodes.indexOf(note);
				if (index === -1) throw new Error("didn't find self in sorted");
				nodes.splice(index, 1);
			});
			// no need to sort because we only removed some nodes, so the remaining nodes are still sorted
			set(nodes);
		}

		getInterval() {
			return this.interval;
		}

		updateInterval(interval: Interval) {
			this.interval = interval;
			set(nodes);
		}

		absInterval() {
			let interval = this.interval;
			let node = this.parent;
			while (node) {
				interval = interval.add(node.interval);
				node = node.parent;
			}
			return interval;
		}
	}

	nodes.push(new Node(new Interval(1), null));
	const { set, subscribe } = writable(nodes);

	return { subscribe };
}
