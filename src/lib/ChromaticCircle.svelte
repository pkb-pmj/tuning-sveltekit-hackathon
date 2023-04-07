<script lang="ts">
	import { derived, writable, type Readable } from 'svelte/store';
	import CentLine from './CentLine.svelte';
	import ChromaticCircleNode from './ChromaticCircleNode.svelte';
	import ChromaticCircleNoteSlices from './ChromaticCircleNoteSlices.svelte';
	import { Interval } from './interval';
	import IntervalArc from './IntervalArc.svelte';
	import type { Node } from './intervalTree';
	import { keyLabelsEn, type KeyboardStore } from './keyboard';

	export let tree: Readable<Node[]>;
	export let keyboard: KeyboardStore;

	const playing = derived([tree, keyboard], ([tree, keyboard]) =>
		tree
			.filter((node) => {
				const i = Math.round(node.absInterval.normalized().log2valueOf() * 12 + 12) % 12;
				return keyboard[i].pressed;
			})
			.sort(
				(a, b) =>
					a.absInterval.add(new Interval(2)).normalized().log2valueOf() -
					b.absInterval.add(new Interval(2)).normalized().log2valueOf(),
			),
	);
	const intervals = derived([playing], ([playing]) => {
		if (playing.length < 2) return [];

		let intervals: [Interval, Interval][] = [];
		for (let i = 0; i < playing.length; i++) {
			const start = playing[i].absInterval.normalized();
			const end = playing[(i + 1) % playing.length].absInterval.normalized();
			const delta = end.sub(start).add(new Interval(2)).normalized();
			intervals.push([start, delta]);
		}
		return intervals;
	});

	const selected = writable<Node[]>([]);
	let interval: string;

	function addChild() {
		$selected.forEach((child) => child.addChild(new Interval(interval).normalized()));
	}
	function updateInterval() {
		$selected.forEach((child) => child.setInterval(new Interval(interval).normalized()));
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
		intervalToDivide = $selected[1].absInterval
			.sub($selected[0].absInterval)
			// .add(new Interval(2))
			.normalized();
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
			<g class="playing">
				<IntervalArc {start} {delta} radius={80} />
			</g>
		{/each}
	</g>
	<g>
		{#each $tree as node, i (node)}
			<ChromaticCircleNode {node} {playing} {i} {selected} />
		{/each}
	</g>
</svg>

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
