<script lang="ts">
	import type { Readable } from 'svelte/store';
	import ChromaticCircleNode from './ChromaticCircleNode.svelte';
	import type { Node } from './intervalTree';

	export let tree: Readable<Node[]>;
</script>

<svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg">
	{#each $tree as node}
		<ChromaticCircleNode {node} />
	{/each}
</svg>
