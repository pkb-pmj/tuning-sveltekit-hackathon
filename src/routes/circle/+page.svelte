<script lang="ts">
	import ChromaticCircle from '$lib/ChromaticCircle.svelte';
	import { intervalTree } from '$lib/intervalTree';

	const tree = intervalTree();
</script>

<ChromaticCircle {tree} />
