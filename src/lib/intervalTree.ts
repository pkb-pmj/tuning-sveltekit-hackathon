import type { Interval } from './interval';

export class Node {
	private interval: Interval;
	private parent: Node | null;
	private children: Node[] = [];
	sorted: Node[] = [this];

	constructor(interval: Interval, parent: Node | null) {
		this.interval = interval;
		this.parent = parent;
	}

	addChild(interval: Interval) {
		const child = new Node(interval, this);
		this.children.push(child);
		this.sorted.push(child);
		this.sorted.sort((a, b) => a.absInterval().log2valueOf() - b.absInterval().log2valueOf());
	}

	removeSelf() {
		let index = this.parent?.children.indexOf(this);
		if (index === undefined) throw new Error("can't remove the root node");
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
			const index = this.sorted.indexOf(note);
			if (index === -1) throw new Error("didn't find self in sorted");
			this.sorted.splice(index);
		});
		// no need to sort because we only removed some nodes, so the remaining nodes are still sorted
	}

	updateInterval(interval: Interval) {
		this.interval = interval;
		this.sorted.sort((a, b) => a.absInterval().log2valueOf() - b.absInterval().log2valueOf());
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
