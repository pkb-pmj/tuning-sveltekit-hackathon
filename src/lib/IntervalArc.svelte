<script lang="ts">
	import { getContext } from 'svelte';
	import IntervalMathMl from './IntervalMathML.svelte';
	import type { Interval } from './interval';
	import type { Writable } from 'svelte/store';
	import IntervalArcLabel from './IntervalArcLabel.svelte';

	export let start: Interval;
	export let delta: Interval;
	export let radius: number;
	export let label = true;
	export let selectable = false;

	const selectedInterval = getContext<Writable<Interval | null>>('selectedInterval');

	function select() {
		if (selectable) {
			$selectedInterval = delta.abs();
		}
	}

	$: startAngle = start.log2valueOf() - 1 / 4;
	$: deltaAngle = delta.log2valueOf();
	$: midpoint = startAngle + deltaAngle / 2;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<circle
	on:click={select}
	cx="0"
	cy="0"
	r={radius}
	pathLength={1}
	stroke-dasharray="1"
	stroke-dashoffset={1 - deltaAngle}
	style:transform="rotate({startAngle}turn)"
/>
{#if label}
	<IntervalArcLabel angle={midpoint} {radius}>
		<IntervalMathMl interval={delta.abs()} display="block" />
	</IntervalArcLabel>
{/if}

<style>
	circle {
		cursor: pointer;
		stroke: var(--color);
		stroke-width: 4px;
		fill: none;
		stroke-opacity: var(--opacity, 0.2);
		transition: stroke 0.1s, stroke-opacity 0.1s, transform var(--transform-duration, 1s),
			stroke-dashoffset var(--transform-duration, 1s), r var(--transform-duration, 1s);
	}
</style>
