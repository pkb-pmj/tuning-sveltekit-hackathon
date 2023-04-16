<script lang="ts">
	import { getContext } from 'svelte';
	import type { IntervalTreeJSON } from '$lib/intervalTree';
	import type { Node } from '$lib/intervalTree';

	export let json: IntervalTreeJSON;

	const root = getContext<Node>('root');

	function setTree() {
		root.children.forEach((child) => child.removeSelf());
		root.addFromJSON(json);
	}
</script>

<li>
	<span>
		<slot />
	</span>
	<button on:click={setTree}>Done</button>
</li>
