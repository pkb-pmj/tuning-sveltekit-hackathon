<script lang="ts">
	import ChromaticCircle from '$lib/ChromaticCircle.svelte';
	import { intervalTree } from '$lib/intervalTree';
	import { keyboardStore } from '$lib/keyboard';

	const tree = intervalTree();
	const keyboard = keyboardStore();
</script>

<ChromaticCircle {tree} {keyboard} />
