<script lang="ts">
	import type { Readable } from 'svelte/store';
	import { Interval } from './interval';
	import type { Node } from './intervalTree';

	export let tree: Readable<Node[]>;

	let interval: string;
</script>

<input type="text" bind:value={interval} />
{#each $tree as node}
	<li>
		<span>{node.absInterval().valueOf()}</span>
		<button on:click={() => node.addChild(new Interval(interval))}>Add child</button>
		<button on:click={() => node.updateInterval(new Interval(interval))}>Update interval</button>
		<button on:click={() => node.removeSelf()}>Remove</button>
	</li>
{/each}
