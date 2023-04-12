<script lang="ts">
	import IntervalArc from './IntervalArc.svelte';
	import type { Interval } from './interval';
	import { splitIntoPureAndComma } from './pureIntervals';

	export let start: Interval;
	export let delta: Interval;
	export let radius: number;

	$: ({ pure, remainder } = splitIntoPureAndComma(delta));
	$: midpoint = start.add(pure.value);
</script>

<IntervalArc {start} delta={pure.value} {radius} />
<g style:--color="red">
	<IntervalArc start={midpoint} delta={remainder} {radius} label={false} />
</g>
