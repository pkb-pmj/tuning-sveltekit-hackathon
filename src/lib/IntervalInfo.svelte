<script lang="ts">
	import IntervalMathMl from './IntervalMathML.svelte';
	import type { Interval } from './interval';
	import { splitIntoPureAndComma } from './pureIntervals';

	export let interval: Interval;

	$: ({ pure, remainder, comma } = splitIntoPureAndComma(interval));
</script>

<IntervalMathMl {interval} display="inline" vertical />
{interval.cents().toFixed(2)} cents
{pure.name}
{#if comma === null}
	{remainder.log2valueOf() < 0 ? '-' : '+'}
	<IntervalMathMl interval={remainder} display="inline" vertical />
{:else if comma.diff.n !== 0}
	{comma.diff.s === -1 ? '-' : '+'}
	{#if comma.diff.n !== comma.diff.d}
		{comma.diff.n}/{comma.diff.d}
	{/if}
	{comma.name}
{/if}
