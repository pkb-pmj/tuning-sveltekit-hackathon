<script lang="ts">
	import { setContext } from 'svelte';
	import type { IntervalTree, Node } from '$lib/intervalTree';

	export let tree: IntervalTree;
	export let root: Node;

	setContext('root', root);
	setContext('intervalTree', tree);
</script>

<ol>
	<slot />
</ol>
