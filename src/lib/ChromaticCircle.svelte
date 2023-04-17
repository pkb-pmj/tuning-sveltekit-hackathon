<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';
	import CentLine from './CentLine.svelte';
	import ChromaticCircleNode from './ChromaticCircleNode.svelte';
	import ChromaticCircleNoteSlices from './ChromaticCircleNoteSlices.svelte';
	import type { Interval } from './interval';
	import type { IntervalTree, Node } from './intervalTree';
	import { keyLabelsEn, type KeyboardStore } from './keyboard';
	import IntervalArc from './IntervalArc.svelte';
	import { AppHistory } from './history';
	import { getContext } from 'svelte';

	export let tree: IntervalTree;
	export let keyboard: KeyboardStore;

	const selectedInterval = getContext<Writable<Interval | null>>('selectedInterval');
	const storedInterval = getContext<Writable<Interval | null>>('storedInterval');
	const selectedNotes = getContext<Writable<Node[]>>('selectedNotes');
	const playing = getContext<Readable<Node[]>>('playing');
	const active = getContext<Readable<Node[]>>('active');
	const intervals = getContext<Readable<[Interval, Interval][]>>('intervals');
	const frequencies = getContext<Readable<number[]>>('frequencies');

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
		console.debug(root.toJSON());
		if (historyFlag) {
			history.push(root.toJSON());
		} else {
			historyFlag = true;
		}
	}

	$: pushToHistory($tree);
</script>

<svelte:window on:keydown={onKeyDown} />
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

<style>
	svg {
		min-width: 60vmin;
		max-height: 100%;
		aspect-ratio: 1;
		user-select: none;
	}
	@media (min-aspect-ratio: 1/1) {
		svg {
			min-height: calc(100vh - 100px - 2em);
		}
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
