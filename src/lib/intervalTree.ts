import { writable, type Readable } from 'svelte/store';
import { Interval } from './interval';

export interface Node {
	addChild(interval: Interval): void;
	removeSelf(): void;
	getInterval(): Interval;
	updateInterval(interval: Interval): void;
	absInterval(): Interval;
}

export function intervalTree(): Readable<Node[]> {
	const sorted: Node[] = [];

	class Node {
		private interval: Interval;
		private parent: Node | null;
		private children: Node[] = [];

		constructor(interval: Interval, parent: Node | null) {
			this.interval = interval;
			this.parent = parent;
		}

		addChild(interval: Interval) {
			const child = new Node(interval, this);
			this.children.push(child);
			sorted.push(child);
			sorted.sort((a, b) => a.absInterval().log2valueOf() - b.absInterval().log2valueOf());
			set(sorted);
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
				const index = sorted.indexOf(note);
				if (index === -1) throw new Error("didn't find self in sorted");
				sorted.splice(index, 1);
			});
			// no need to sort because we only removed some nodes, so the remaining nodes are still sorted
			set(sorted);
		}

		getInterval() {
			return this.interval;
		}

		updateInterval(interval: Interval) {
			this.interval = interval;
			sorted.sort((a, b) => a.absInterval().log2valueOf() - b.absInterval().log2valueOf());
			set(sorted);
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

	sorted.push(new Node(new Interval(1), null));
	const { set, subscribe } = writable(sorted);

	return { subscribe };
}
