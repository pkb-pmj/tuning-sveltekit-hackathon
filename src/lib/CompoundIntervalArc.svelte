<script lang="ts">
	import { getContext } from 'svelte';
	import IntervalArc from './IntervalArc.svelte';
	import type { Interval } from './interval';
	import { splitIntoPureAndComma } from './pureIntervals';
	import type { Writable } from 'svelte/store';

	export let start: Interval;
	export let delta: Interval;
	export let radius: number;

	const selectedInterval = getContext<Writable<Interval | null>>('selectedInterval');

	$: ({ pure, remainder } = splitIntoPureAndComma(delta));
	$: midpoint = start.add(pure.value);

	function select() {
		$selectedInterval = delta.abs();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<g on:click={select}>
	<IntervalArc {start} delta={pure.value} {radius} />
	<g style:--color="red">
		<IntervalArc start={midpoint} delta={remainder} {radius} label={false} />
	</g>
</g>
