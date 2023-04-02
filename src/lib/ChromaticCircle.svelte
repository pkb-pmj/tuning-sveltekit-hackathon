<script lang="ts">
	import { get, type Readable } from 'svelte/store';
	import CentLine from './CentLine.svelte';
	import ChromaticCircleNode from './ChromaticCircleNode.svelte';
	import ChromaticCircleNoteSlices from './ChromaticCircleNoteSlices.svelte';
	import { Interval } from './interval';
	import type { Node } from './intervalTree';
	import { keyLabelsEn, type KeyboardStore } from './keyboard';

	export let tree: Readable<Node[]>;
	export let keyboard: KeyboardStore;

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
		{#each $tree as node (node.id)}
			<ChromaticCircleNode {node} {keyboard} bind:current />
		{/each}
	</g>
</svg>
