<script lang="ts">
	import { derived, writable, type Readable } from 'svelte/store';
	import CentLine from './CentLine.svelte';
	import ChromaticCircleNode from './ChromaticCircleNode.svelte';
	import ChromaticCircleNoteSlices from './ChromaticCircleNoteSlices.svelte';
	import { Interval } from './interval';
	import type { Node } from './intervalTree';
	import { keyLabelsEn, type KeyboardStore } from './keyboard';
	import Waveform from './Waveform.svelte';
	import CompoundIntervalArc from './CompoundIntervalArc.svelte';
	import IntervalInfo from './IntervalInfo.svelte';

	export let tree: Readable<Node[]>;
	export let keyboard: KeyboardStore;

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

	const selected = writable<Node[]>([]);

	const active = derived([playing, selected, tree], ([playing, selected, tree]) => {
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

	let interval: string;

	function addChild() {
		$selected.forEach((child) => child.addChild(new Interval(interval).modSigned()));
	}
	function updateInterval() {
		$selected.forEach((child) => child.setInterval(new Interval(interval).modSigned()));
	}
	function removeSelf() {
		$selected.forEach((child) => child.removeSelf());
	}
	function unselect(event: MouseEvent) {
		if (event.shiftKey) return;
		$selected = [];
	}
	let intervalToDivide: Interval | null = null;
	function selectForDivide() {
		intervalToDivide = $selected[1].absInterval.sub($selected[0].absInterval).modSigned();
		$selected = [];
	}
	function divideBetween() {
		intervalToDivide = intervalToDivide!.div($selected.length);
		$selected.forEach((node) => {
			node.setInterval(node.relInterval.add(intervalToDivide!));
		});
	}

	const cents = Array(240)
		.fill(0)
		.map((_, i) => i * 5);
</script>

<Waveform {frequencies} />
<input type="text" bind:value={interval} />
<button on:click={addChild} disabled={$selected.length === 0}>Add child</button>
<button on:click={updateInterval} disabled={$selected.length === 0}> Update interval </button>
<button on:click={removeSelf} disabled={$selected.length === 0}>Remove</button>
<button on:click={selectForDivide} disabled={$selected.length !== 2}>Select for divide</button>
<button on:click={divideBetween} disabled={$selected.length === 0}>Divide between</button>
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
			<g class="playing" on:click|stopPropagation>
				<CompoundIntervalArc {start} {delta} radius={80} />
			</g>
		{/each}
	</g>
	<g>
		{#each $tree as node (node)}
			<ChromaticCircleNode {node} {playing} {selected} />
		{/each}
	</g>
</svg>
{#if $selected.length === 1}
	<IntervalInfo interval={$selected[0].absInterval.modUnsigned()} />
{/if}

<style>
	button {
		appearance: none;
		border: none;
		border-radius: 0.4em;
		padding: 0.4em 1em;
		margin: 0.1em;
		color: black;
		background-color: #9e9;
		cursor: pointer;
	}
	button:disabled {
		color: #444;
		background-color: #bbb;
		cursor: not-allowed;
	}
	svg {
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
</style>
