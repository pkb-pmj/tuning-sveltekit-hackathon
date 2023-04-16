<script lang="ts">
	import { setContext } from 'svelte';
	import type { Node } from '$lib/intervalTree';

	export let root: Node;

	setContext('root', root);
</script>

<ol>
	<slot />
</ol>
