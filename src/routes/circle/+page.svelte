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

<ChromaticCircle {tree} {keyboard} />
<List {tree} {root}>
	{#each meantone as { text, data }}
		<ListItem json={data}>{text}</ListItem>
	{/each}
</List>
