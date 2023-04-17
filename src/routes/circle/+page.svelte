<script lang="ts">
	import ChromaticCircle from '$lib/ChromaticCircle.svelte';
	import List from '$lib/guide/List.svelte';
	import ListItem from '$lib/guide/ListItem.svelte';
	import { data as meantone } from '$lib/guide/data/meantone';
	import { intervalTree } from '$lib/intervalTree';
	import { keyboardStore } from '$lib/keyboard';

	const tree = intervalTree();
	const keyboard = keyboardStore();
	const root = $tree[0];
</script>

<div class="wrapper">
	<div class="circle">
		<ChromaticCircle {tree} {keyboard} />
	</div>
	<div class="list">
		<List {tree} {root}>
			{#each meantone as { text, data }}
				<ListItem json={data}>{text}</ListItem>
			{/each}
		</List>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-flow: row wrap;
		justify-content: stretch;
		align-items: stretch;
	}
	.circle {
		flex: 2;
		max-height: 100%;
	}
	.list {
		flex: 1;
	}
</style>
