<script lang="ts">
	import { onMount } from 'svelte';
	import { audioContext } from './audioContext';

	export let frequency: number;
	export let isPlaying: boolean;

	let oscillator: OscillatorNode;
	let gain: GainNode;
	$: oscillator && (oscillator.frequency.value = frequency);
	$: gain && gain.gain.linearRampToValueAtTime(isPlaying ? 0.1 : 0, audioContext.currentTime + 0.1);

	onMount(() => {
		oscillator = audioContext.createOscillator();
		gain = audioContext.createGain();
		gain.connect(audioContext.destination);
		oscillator.connect(gain);
		const time = audioContext.currentTime;
		gain.gain.setValueAtTime(0, time);
		oscillator.frequency.value = frequency;
		oscillator.start();
		return () => {
			oscillator.stop();
		};
	});
</script>
