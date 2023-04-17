<script lang="ts">
	import ChromaticCircle from '$lib/ChromaticCircle.svelte';
	import Waveform from '$lib/Waveform.svelte';
	import { createActiveStores } from '$lib/activeStores';
	import Tabs from '$lib/guide/Tabs.svelte';
	import { intervalTree } from '$lib/intervalTree';
	import { keyboardStore } from '$lib/keyboard';
	import Toolbar from '$lib/Toolbar.svelte';
	import { setContext } from 'svelte';
	import Keyboard from '$lib/Keyboard.svelte';

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

<Waveform {frequencies} />
<div class="wrapper">
	<div class="circle">
		<ChromaticCircle {tree} {keyboard} />
	</div>
	<div class="right">
		<div class="toolbar">
			<Toolbar />
		</div>
		<div class="list">
			<Tabs {tree} {root} />
		</div>
		<div class="keyboard">
			<Keyboard {keyboard} />
		</div>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-flow: row wrap;
		justify-content: stretch;
		align-items: stretch;
		gap: 0.5em;
	}
	.circle {
		flex: 2;
		max-height: 100%;
	}
	.right {
		flex: 3 3 fit-content;
		display: flex;
		flex-flow: column nowrap;
		justify-content: stretch;
		align-items: stretch;
		gap: 0.5em;
	}
	.toolbar {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
	}
	.list {
		flex: content;
		--hue: 0;
		--saturation: 0%;
		--value: 70%;
		--alpha: 0.4;
	}
</style>
