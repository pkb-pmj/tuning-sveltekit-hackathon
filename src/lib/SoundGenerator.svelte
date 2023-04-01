<script lang="ts">
	import { onMount } from 'svelte';
	import { audioContext } from './audioContext';

	export let frequency: number;

	let oscillator: OscillatorNode;
	$: oscillator && (oscillator.frequency.value = frequency);

	onMount(() => {
		oscillator = audioContext.createOscillator();
		oscillator.connect(audioContext.destination);
		oscillator.frequency.value = frequency;
		oscillator.start();
		return () => oscillator.stop();
	});
</script>
