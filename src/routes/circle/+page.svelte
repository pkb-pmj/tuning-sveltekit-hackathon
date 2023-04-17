<script lang="ts">
	import ChromaticCircle from '$lib/ChromaticCircle.svelte';
	import { createActiveStores } from '$lib/activeStores';
	import Tabs from '$lib/guide/Tabs.svelte';
	import { intervalTree } from '$lib/intervalTree';
	import { keyboardStore } from '$lib/keyboard';
	import { setContext } from 'svelte';

	const tree = intervalTree();
	const keyboard = keyboardStore();
	const root = $tree[0];

	const {
		selectedInterval,
		storedInterval,
		selectedNotes,
		playing,
		active,
		intervals,
		frequencies,
	} = createActiveStores(tree, keyboard);

	setContext('intervalTree', tree);
	setContext('selectedInterval', selectedInterval);
	setContext('storedInterval', storedInterval);
	setContext('selectedNotes', selectedNotes);
	setContext('playing', playing);
	setContext('active', active);
	setContext('intervals', intervals);
	setContext('frequencies', frequencies);
</script>

<div class="wrapper">
	<div class="circle">
		<ChromaticCircle {tree} {keyboard} />
	</div>
	<div class="list">
		<Tabs {tree} {root} />
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
		padding: 0.5em;
		--hue: 0;
		--saturation: 0%;
		--value: 90%;
		--alpha: 0.4;
	}
</style>
