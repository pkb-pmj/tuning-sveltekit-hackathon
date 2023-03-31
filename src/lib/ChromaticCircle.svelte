<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	import { get, type Readable } from 'svelte/store';
	import ChromaticCircleNode from './ChromaticCircleNode.svelte';
	import { Interval } from './interval';
	import type { Node } from './intervalTree';

	export let tree: Readable<Node[]>;

	let current: Node = get(tree)[0];
	let interval: string;

	const min = (a: number, b: number) => (a < b ? a : b);

	let svg: SVGSVGElement;
	let size: number = 100;
	$: viewBox = `${-size / 2} ${-size / 2} ${size} ${size}`;

	if (browser) {
		const resizeObserver = new ResizeObserver(() => {
			if (svg) size = min(svg.clientWidth, svg.clientHeight);
		});
		onMount(() => {
			resizeObserver.observe(svg);
		});
		onDestroy(() => {
			resizeObserver.disconnect();
		});
	}
</script>

{#if current}
	<input type="text" bind:value={interval} />
	<button on:click={() => current.addChild(new Interval(interval))}>Add child</button>
	<button on:click={() => current.updateInterval(new Interval(interval))}>Update interval</button>
	<button on:click={() => current.removeSelf()}>Remove</button>
{/if}
<svg xmlns="http://www.w3.org/2000/svg" {viewBox} bind:this={svg}>
	{#each $tree as node}
		<ChromaticCircleNode {node} bind:current {size} />
	{/each}
</svg>
