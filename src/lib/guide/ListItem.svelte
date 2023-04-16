<script lang="ts">
	import { getContext } from 'svelte';
	import type { IntervalTree, IntervalTreeJSON } from '$lib/intervalTree';
	import type { Node } from '$lib/intervalTree';

	export let json: IntervalTreeJSON;

	const tree = getContext<IntervalTree>('intervalTree');
	const root = getContext<Node>('root');

	function setTree() {
		root.updateFromJSON(json);
		tree.update();
	}
</script>

<li>
	<span>
		<slot />
	</span>
	<button on:click={setTree}>Done</button>
</li>
