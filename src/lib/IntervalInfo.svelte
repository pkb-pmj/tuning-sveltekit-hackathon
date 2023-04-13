<script lang="ts">
	import IntervalMathMl from './IntervalMathML.svelte';
	import type { Interval } from './interval';
	import { splitIntoPureAndComma } from './pureIntervals';

	export let interval: Interval;

	$: ({ pure, remainder, comma } = splitIntoPureAndComma(interval));
</script>

<div class="wrapper">
	<div class="row">
		<IntervalMathMl {interval} display="inline" vertical />
	</div>
	<div class="row">
		{interval.cents().toFixed(2)} cents
	</div>
	<div class="row">
		{#if pure.value.log2valueOf() !== 0 || comma?.diff.n === 0}
			{pure.name}
			{remainder.log2valueOf() < 0 ? '-' : remainder.log2valueOf() > 0 ? '+' : ''}
		{/if}
		{#if comma === null}
			<IntervalMathMl interval={remainder} display="inline" vertical />
		{:else if comma.diff.n !== 0}
			{#if comma.diff.n !== comma.diff.d}
				{comma.diff.n}{#if comma.diff.d !== 1}/{comma.diff.d}{/if}
			{/if}
			{comma.name}
		{/if}
	</div>
</div>
