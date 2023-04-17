<script lang="ts">
	import ChromaticCircle from '$lib/ChromaticCircle.svelte';
	import Tabs from '$lib/guide/Tabs.svelte';
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
