<script lang="ts">
	import { derived, writable, type Readable } from 'svelte/store';
	import CentLine from './CentLine.svelte';
	import ChromaticCircleNode from './ChromaticCircleNode.svelte';
	import ChromaticCircleNoteSlices from './ChromaticCircleNoteSlices.svelte';
	import type { Interval } from './interval';
	import type { Node } from './intervalTree';
	import { keyLabelsEn, type KeyboardStore } from './keyboard';
	import Waveform from './Waveform.svelte';
	import IntervalArc from './IntervalArc.svelte';
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
	function multiplyStoredInterval() {
		$storedInterval = $storedInterval!.mul(factor);
	}
	function divideStoredInterval() {
		$storedInterval = $storedInterval!.div(factor);
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
	let factor = 2;

	function selectAll() {
		$selected = $tree.slice();
	}
	function addChildUp() {
		$selected.forEach((child) => child.addChild(interval));
	}
	function addChildDown() {
		$selected.forEach((child) => child.addChild(interval.mul(-1)));
	}
	function updateInterval() {
		$selected.forEach((child) =>
			child.setInterval(interval.mul(Math.sign(child.relInterval.log2valueOf()))),
		);
	}
	function removeSelf() {
		$selected.forEach((child) => child.removeSelf());
	}
	function unselect(event: MouseEvent) {
		if (event.shiftKey) return;
		$selected = [];
		$selectedInterval = null;
	}
	function addToSelected() {
		$selected.forEach((node) => {
			const base = node.relInterval;
			const sign = Math.sign(base.log2valueOf());
			node.setInterval(base.add($storedInterval!.mul(sign)));
		});
	}
	function subtractFromSelected() {
		$selected.forEach((node) => {
			const base = node.relInterval;
			const sign = Math.sign(base.log2valueOf());
			node.setInterval(base.sub($storedInterval!.mul(sign)));
		});
	}

	const cents = Array(240)
		.fill(0)
		.map((_, i) => i * 5);

	function onKeyDown(event: KeyboardEvent) {
		if (event.code === 'Backspace') removeSelf();
	}
</script>

<svelte:window on:keydown={onKeyDown} />
<Waveform {frequencies} />
<div class="wrapper">
	<div class="toolbar">
		<div class="intervalBox">
			{#if $selected.length > 0}
				<select bind:value={intervalIndex}>
					{#each pureIntervals.slice(1, -1) as pure, i}
						<option value={i}>
							{pure.value.frac()} – {pure.name}
						</option>
					{/each}
				</select>
				<div class="row">
					<button on:click={addChildUp}>Add note up</button>
					<button on:click={addChildDown}>Add note down</button>
				</div>
				<button on:click={updateInterval} style:background-color="#48f8">Update interval</button>
				<button on:click={removeSelf} style:background-color="#f008">Remove</button>
			{:else}
				<button on:click={selectAll} style:background-color="#48f8">Select all notes</button>
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
				<input type="number" bind:value={factor} min="2" max="19" />
				<div class="row">
					<button style:background-color="#48f8" on:click={multiplyStoredInterval}>Multiply</button>
					<button style:background-color="#48f8" on:click={divideStoredInterval}>Divide</button>
				</div>
				<div class="row">
					<button style:background-color="#48f8" on:click={addToSelected}>Add to selected</button>
					<button style:background-color="#48f8" on:click={subtractFromSelected}>
						Subtract from selected
					</button>
				</div>
				<button style:background-color="#f008" on:click={clearStoredInterval}>Clear </button>
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
					<IntervalArc {start} {delta} radius={80} selectable />
				</g>
			{/each}
		</g>
		<g>
			{#each $tree as node (node)}
				<ChromaticCircleNode {node} {playing} {selected} />
			{/each}
		</g>
	</svg>
</div>

<style>
	.wrapper {
		display: flex;
		flex-flow: row wrap;
	}
	select {
		display: block;
		width: 100%;
		cursor: pointer;
		box-sizing: border-box;
	}
	input {
		display: block;
		width: 100%;
		box-sizing: border-box;
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
	.toolbar {
		flex: 1 0 min-content;
		display: flex;
		flex-flow: row wrap;
		justify-content: stretch;
		align-items: stretch;
		padding: 0.4em;
		gap: 0.4em;
	}
	.intervalBox {
		flex: 1 1 0;
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		align-items: stretch;
		height: 10em;
		padding: 0.4em;
		gap: 0.4em;
		border-radius: 0.4em;
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
	.row {
		display: flex;
		flex-flow: row nowrap;
		justify-content: stretch;
		gap: 0.4em;
	}
	.row > button {
		flex: 1;
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
