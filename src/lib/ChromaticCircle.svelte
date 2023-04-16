<script lang="ts">
	import { derived, writable, type Readable } from 'svelte/store';
	import CentLine from './CentLine.svelte';
	import ChromaticCircleNode from './ChromaticCircleNode.svelte';
	import ChromaticCircleNoteSlices from './ChromaticCircleNoteSlices.svelte';
	import type { Interval } from './interval';
	import type { IntervalTree, Node } from './intervalTree';
	import { keyLabelsEn, type KeyboardStore } from './keyboard';
	import Waveform from './Waveform.svelte';
	import IntervalArc from './IntervalArc.svelte';
	import { setContext } from 'svelte';
	import Toolbar from './Toolbar.svelte';
	import { AppHistory } from './history';

	export let tree: IntervalTree;
	export let keyboard: KeyboardStore;

	const selectedInterval = writable<Interval | null>(null);
	const storedInterval = writable<Interval | null>(null);
	const selectedNotes = writable<Node[]>([]);
	setContext('intervalTree', tree);
	setContext('selectedInterval', selectedInterval);
	setContext('storedInterval', storedInterval);
	setContext('selectedNotes', selectedNotes);

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

	function unselect(event: MouseEvent) {
		if (event.shiftKey) return;
		$selectedNotes = [];
		$selectedInterval = null;
	}

	const cents = Array(240)
		.fill(0)
		.map((_, i) => i * 5);

	const root = $tree[0];
	const history = new AppHistory(root.toJSON());
	let historyFlag = false;

	function onKeyDown(evt: KeyboardEvent) {
		if ((evt.key === 'Z' || evt.key === 'z') && (evt.ctrlKey || evt.metaKey)) {
			if (evt.shiftKey) {
				root.updateFromJSON(history.forward());
			} else {
				root.updateFromJSON(history.backward());
			}
			historyFlag = false;
			tree.update();
		}
	}

	function pushToHistory(_tree: Node[]) {
		if (historyFlag) {
			history.push(root.toJSON());
		} else {
			historyFlag = true;
		}
	}

	$: pushToHistory($tree);
</script>

<svelte:window on:keydown={onKeyDown} />
<Waveform {frequencies} />
<div class="wrapper">
	<Toolbar />
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200" on:click={unselect}>
		<g>
			<ChromaticCircleNoteSlices labels={keyLabelsEn} {keyboard} />
		</g>
		<g>
			{#each cents as i}
				<CentLine {i} />
			{/each}
		</g>
		<g>
			{#each $intervals as [start, delta]}
				<g class="playing" on:click|stopPropagation={() => ($selectedInterval = delta)}>
					<IntervalArc {start} {delta} radius={80} selectable />
				</g>
			{/each}
		</g>
		<g>
			{#each $tree as node (node)}
				<ChromaticCircleNode {node} {playing} />
			{/each}
		</g>
	</svg>
</div>

<style>
	.wrapper {
		display: flex;
		flex-flow: row nowrap;
		align-items: stretch;
		gap: 0.5em;
	}
	svg {
		max-width: 100vw;
		max-height: 100vh;
		aspect-ratio: 1;
		user-select: none;
	}
	g.playing {
		--color: red;
		--transform-duration: 0.2s;
	}
	g.playing:nth-child(2n) {
		--color: blue;
	}
	g.playing:last-child:not(:nth-child(2n)) {
		--color: green;
	}
	g.playing:hover {
		--opacity: 0.4;
	}
</style>
