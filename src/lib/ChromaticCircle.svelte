<script lang="ts">
	import { derived, get, type Readable } from 'svelte/store';
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
				const i = Math.round(node.absInterval().normalized().log2valueOf() * 12 + 12) % 12;
				return keyboard[i].pressed;
			})
			.sort(
				(a, b) =>
					a.absInterval().normalized().log2valueOf() - b.absInterval().normalized().log2valueOf(),
			),
	);
	const intervals = derived([playing], ([playing]) => {
		if (playing.length < 2) return [];

		let intervals: [Interval, Interval][] = [];
		for (let i = 0; i < playing.length; i++) {
			const start = playing[i].absInterval().normalized();
			const end = playing[(i + 1) % playing.length].absInterval().normalized();
			const delta = end.sub(start).add(new Interval(2)).normalized();
			intervals.push([start, delta]);
		}
		return intervals;
	});
	let current: Node = get(tree)[0];
	let interval: string;

	const cents = Array(240)
		.fill(0)
		.map((_, i) => i * 5);
</script>

{#if current}
	<input type="text" bind:value={interval} />
	<button on:click={() => current.addChild(new Interval(interval).normalized())}>Add child</button>
	<button on:click={() => current.updateInterval(new Interval(interval).normalized())}>
		Update interval
	</button>
	<button on:click={() => current.removeSelf()}>Remove</button>
{/if}
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
	<g>
		<ChromaticCircleNoteSlices labels={keyLabelsEn} />
	</g>
	<g>
		{#each cents as i}
			<CentLine {i} />
		{/each}
	</g>
	<g>
		{#each $intervals as [start, delta]}
			<IntervalArc {start} {delta} radius={80} />
		{/each}
	</g>
	<g>
		{#each $tree as node, i (node.id)}
			<ChromaticCircleNode {node} {playing} {i} bind:current />
		{/each}
	</g>
</svg>
