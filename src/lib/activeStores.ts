import { derived, writable } from 'svelte/store';
import type { IntervalTree, Node } from './intervalTree';
import type { KeyboardStore } from './keyboard';
import type { Interval } from './interval';

export function createActiveStores(tree: IntervalTree, keyboard: KeyboardStore) {
	const selectedInterval = writable<Interval | null>(null);
	const storedInterval = writable<Interval | null>(null);
	const selectedNotes = writable<Node[]>([]);

	const cmp = (a: Node, b: Node) =>
		a.absInterval.modUnsigned().log2valueOf() - b.absInterval.modUnsigned().log2valueOf();

	const playing = derived([tree, keyboard], ([tree, keyboard]) =>
		tree
			.filter((node) => {
				const i = Math.round(node.absInterval.modUnsigned().log2valueOf() * 12 + 12) % 12;
				return keyboard[i].pressed;
			})
			.sort(cmp),
	);

	const active = derived([playing, selectedNotes, tree], ([playing, selected, tree]) => {
		return tree.filter((node) => playing.includes(node) || selected.includes(node)).sort(cmp);
	});

	const intervals = derived([active, tree], ([active]) => {
		if (active.length < 2) return [];

		let intervals: [Interval, Interval][] = [];
		for (let i = 0; i < active.length; i++) {
			const start = active[i].absInterval.modUnsigned();
			const end = active[(i + 1) % active.length].absInterval.modUnsigned();
			const delta = end.sub(start).modUnsigned();
			intervals.push([start, delta]);
		}
		return intervals;
	});

	const frequencies = derived([playing], ([playing]) => {
		return playing.map((node) => node.absInterval.modUnsigned().valueOf() * 256);
	});

	return {
		selectedInterval,
		storedInterval,
		selectedNotes,
		playing,
		active,
		intervals,
		frequencies,
	};
}
