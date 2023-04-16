<script lang="ts">
	import { getContext } from 'svelte';
	import type { Readable, Writable } from 'svelte/store';
	import type { Interval } from './interval';
	import type { IntervalTree, Node } from './intervalTree';
	import { pureIntervals } from './pureIntervals';
	import IntervalInfo from './IntervalInfo.svelte';

	const intervalTree = getContext<IntervalTree>('intervalTree');
	const selectedInterval = getContext<Writable<Interval | null>>('selectedInterval');
	const storedInterval = getContext<Writable<Interval | null>>('storedInterval');
	const selectedNotes = getContext<Writable<Node[]>>('selectedNotes');

	$: editing = $selectedNotes.length > 0;

	let intervalIndex = 7;
	$: interval = pureIntervals[intervalIndex + 1].value;
	let factor = 2;

	function addNoteUp() {
		$selectedNotes.forEach((child) => child.addChild(interval));
		intervalTree.update();
	}
	function addNoteDown() {
		$selectedNotes.forEach((child) => child.addChild(interval.mul(-1)));
		intervalTree.update();
	}
	function updateInterval() {
		$selectedNotes.forEach((child) =>
			child.setInterval(interval.mul(Math.sign(child.relInterval.log2valueOf()))),
		);
		intervalTree.update();
	}
	function selectAll() {
		$selectedNotes = $intervalTree.slice();
	}
	function deleteNotes() {
		$selectedNotes.forEach((child) => child.removeSelf());
		intervalTree.update();
	}

	function storeInterval() {
		$storedInterval = $selectedInterval;
	}

	function addToSelected() {
		$selectedNotes.forEach((node) => {
			const base = node.relInterval;
			const sign = Math.sign(base.log2valueOf());
			node.setInterval(base.add($storedInterval!.mul(sign)));
		});
		intervalTree.update();
	}
	function subtractFromSelected() {
		$selectedNotes.forEach((node) => {
			const base = node.relInterval;
			const sign = Math.sign(base.log2valueOf());
			node.setInterval(base.sub($storedInterval!.mul(sign)));
		});
		intervalTree.update();
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
		if ($selectedNotes.length === 2) {
			$selectedInterval = $selectedNotes[0].absInterval
				.sub($selectedNotes[1].absInterval)
				.modSigned()
				.abs();
		} else if ($selectedNotes.length > 2) {
			$selectedInterval = null;
		}
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.code === 'Backspace') deleteNotes();
	}
</script>

<svelte:window on:keydown={onKeyDown} />
<div class="toolbar">
	<div class="panel">
		<select bind:value={intervalIndex}>
			{#each pureIntervals.slice(1, -1) as pure, i}
				<option value={i}>
					{pure.value.frac()} – {pure.name}
				</option>
			{/each}
		</select>
		<div class="twoButtons">
			<button on:click={addNoteUp} class="green" disabled={!editing}>Add note up</button>
			<button on:click={addNoteDown} class="green" disabled={!editing}>Add note down</button>
		</div>
		<button on:click={updateInterval} class="blue" disabled={!editing}>Update interval</button>
		<button on:click={selectAll} class="blue">Select all notes</button>
		<button on:click={deleteNotes} class="red" disabled={!editing}>Delete</button>
	</div>
	<div class="panel">
		{#if $selectedInterval}
			<div class="intervalInfo">
				<IntervalInfo interval={$selectedInterval} />
			</div>
			<button class="blue" on:click={storeInterval}> Store selected interval </button>
		{:else if $selectedNotes.length > 1}
			<span>{$selectedNotes.length} intervals selected</span>
		{:else}
			<span>Select an interval</span>
		{/if}
	</div>
	<div class="panel">
		{#if $storedInterval}
			<div class="intervalInfo">
				<IntervalInfo interval={$storedInterval} />
			</div>
			<div class="factorInput">
				<div class="twoButtons">
					<button class="blue" on:click={multiplyStoredInterval}>Multiply by</button>
					<button class="blue" on:click={divideStoredInterval}>Divide by</button>
				</div>
				<input type="number" bind:value={factor} min="2" max="19" />
			</div>
			<div class="twoButtons">
				<button class="green" on:click={addToSelected}>Add to selected</button>
				<button class="green" on:click={subtractFromSelected}> Subtract from selected </button>
			</div>
			<button class="red" on:click={clearStoredInterval}>Clear </button>
		{:else}
			<span>Store an interval</span>
		{/if}
	</div>
</div>

<style>
	.toolbar {
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: stretch;
		gap: 0.5em;
	}
	.panel {
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		align-items: stretch;
		gap: 0.5em;
		padding: 0.5em;
		border-radius: 0.5em;
		background-color: #ddd;
	}
	button {
		appearance: none;
		cursor: pointer;
		border: none;
		border-radius: 0.5em;
		padding: 0.8em 1em;
		color: #000;
		--alpha: 0.4;
		--saturation: 80%;
		--value: 60%;
		background-color: hsl(var(--hue) var(--saturation) var(--value) / var(--alpha));
		transition: 0.2s background-color;
	}
	button:hover {
		--alpha: 0.6;
	}
	button:disabled {
		--saturation: 0%;
		cursor: not-allowed;
		color: #444;
	}
	.twoButtons {
		display: flex;
		flex-flow: column nowrap;
		align-items: stretch;
	}
	.twoButtons button:first-child {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
	.twoButtons button:last-child {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
	.red {
		--hue: 0;
	}
	.green {
		--hue: 120;
	}
	.blue {
		--hue: 220;
	}
	.intervalInfo {
		padding: 0.5em;
		border-radius: 0.5em;
		background-color: #fff;
	}
	select {
		appearance: none;
		cursor: pointer;
		border: none;
		padding: 0.5em;
		border-radius: 0.5em;
		background-color: #fff;
	}
	.factorInput {
		display: flex;
		flex-flow: row nowrap;
	}
	.factorInput .twoButtons {
		flex: 1 min-content;
	}
	.factorInput button {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	input {
		flex: 1;
		display: block;
		width: 100%;
		appearance: none;
		border: none;
		padding: 0.5em;
		border-radius: 0 0.5em 0.5em 0;
		background-color: #fff;
	}
</style>
