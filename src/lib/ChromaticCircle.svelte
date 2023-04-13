<script lang="ts">
	import { derived, writable, type Readable } from 'svelte/store';
	import CentLine from './CentLine.svelte';
	import ChromaticCircleNode from './ChromaticCircleNode.svelte';
	import ChromaticCircleNoteSlices from './ChromaticCircleNoteSlices.svelte';
	import type { Interval } from './interval';
	import type { Node } from './intervalTree';
	import { keyLabelsEn, type KeyboardStore } from './keyboard';
	import Waveform from './Waveform.svelte';
	import CompoundIntervalArc from './CompoundIntervalArc.svelte';
	import IntervalInfo from './IntervalInfo.svelte';
	import { setContext } from 'svelte';
	import { pureIntervals } from './pureIntervals';

	export let tree: Readable<Node[]>;
	export let keyboard: KeyboardStore;

	const selectedInterval = writable<Interval | null>(null);
	setContext('selectedInterval', selectedInterval);
	const storedInterval = writable<Interval | null>(null);
	const selected = writable<Node[]>([]);

	function storeInterval() {
		$storedInterval = $selectedInterval;
	}
	function clearStoredInterval() {
		$storedInterval = null;
	}
	$: {
		if ($selected.length === 2) {
			$selectedInterval = $selected[0].absInterval.sub($selected[1].absInterval).modSigned().abs();
		} else if ($selected.length > 2) {
			$selectedInterval = null;
		}
	}

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

	let intervalIndex = 7;
	$: interval = pureIntervals[intervalIndex + 1].value;

	function addChildUp() {
		$selected.forEach((child) => child.addChild(interval));
	}
	function addChildDown() {
		$selected.forEach((child) => child.addChild(interval.mul(-1)));
	}
	function updateInterval() {
		$selected.forEach((child) => child.setInterval(interval));
	}
	function removeSelf() {
		$selected.forEach((child) => child.removeSelf());
	}
	function unselect(event: MouseEvent) {
		if (event.shiftKey) return;
		$selected = [];
		$selectedInterval = null;
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
<button on:click={selectForDivide} disabled={$selected.length !== 2}>Select for divide</button>
<button on:click={divideBetween} disabled={$selected.length === 0}>Divide between</button>
<div class="wrapper">
	<div class="intervalBox">
		{#if $selected.length > 0}
			<select bind:value={intervalIndex}>
				{#each pureIntervals.slice(1) as pure, i}
					<option value={i}>
						{pure.value.frac()} – {pure.name}
					</option>
				{/each}
			</select>
			<button on:click={addChildUp}>Add child (up)</button>
			<button on:click={addChildDown}>Add child (down)</button>
			<button on:click={updateInterval}> Update interval </button>
			<button on:click={removeSelf}>Remove</button>
		{:else}
			<span>Select and edit a note or multiple notes</span>
		{/if}
	</div>
	<div class="intervalBox">
		{#if $selectedInterval}
			<IntervalInfo interval={$selectedInterval} />
			<button style:background-color="#48f8" on:click={storeInterval}>
				Store selected interval
			</button>
		{:else if $selected.length > 1}
			<span>{$selected.length} intervals selected</span>
		{:else}
			<span>Select an interval</span>
		{/if}
	</div>
	<div class="intervalBox">
		{#if $storedInterval}
			<IntervalInfo interval={$storedInterval} />
			<button style:background-color="#f008" on:click={clearStoredInterval}>
				Clear stored interval
			</button>
		{:else}
			<span>Store an interval</span>
		{/if}
	</div>
</div>
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

<style>
	select {
		cursor: pointer;
	}
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
	.wrapper {
		display: flex;
		padding: 0.4em;
		gap: 0.4em;
	}
	.intervalBox {
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		align-items: stretch;
		width: 10em;
		height: 10em;
		padding: 0.5em;
		border-radius: 0.5em;
		background-color: #eee;
	}
	.intervalBox button {
		align-self: stretch;
		justify-self: end;
		margin: 0;
	}
	.intervalBox span {
		flex: 1;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
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
