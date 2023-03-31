<script lang="ts">
	import { get, type Readable } from 'svelte/store';
	import ChromaticCircleNode from './ChromaticCircleNode.svelte';
	import { Interval } from './interval';
	import type { Node } from './intervalTree';

	export let tree: Readable<Node[]>;

	let current: Node = get(tree)[0];
	let interval: string;
</script>

{#if current}
	<input type="text" bind:value={interval} />
	<button on:click={() => current?.addChild(new Interval(interval))}>Add child</button>
	<button on:click={() => current?.updateInterval(new Interval(interval))}>Update interval</button>
	<button on:click={() => current?.removeSelf()}>Remove</button>
{/if}
<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg">
	{#each $tree as node}
		<ChromaticCircleNode {node} bind:current />
	{/each}
</svg>
