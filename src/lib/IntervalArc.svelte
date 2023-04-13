<script lang="ts">
	import IntervalMathMl from './IntervalMathML.svelte';
	import type { Interval } from './interval';

	export let start: Interval;
	export let delta: Interval;
	export let radius: number;
	export let label = true;

	$: startAngle = start.log2valueOf() - 1 / 4;
	$: deltaAngle = delta.log2valueOf();
	$: midpoint = startAngle + deltaAngle / 2;
</script>

<circle
	cx="0"
	cy="0"
	r={radius}
	pathLength={1}
	stroke-dasharray="1"
	stroke-dashoffset={1 - deltaAngle}
	style:transform="rotate({startAngle}turn)"
/>
{#if label}
	<foreignObject
		width="100px"
		height="20px"
		font-size="14px"
		style:transform="rotate({midpoint}turn) translate({radius}px) rotate(90deg) translate(-15px,
		-2.5px) scale(0.3)"
	>
		<div>
			<IntervalMathMl interval={delta.abs()} display="block" />
		</div>
	</foreignObject>
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
	text {
		font-size: 4px;
		text-anchor: middle;
		dominant-baseline: middle;
		transition: transform var(--transform-duration, 1s);
	}
	foreignObject {
		pointer-events: none;
		transition: transform var(--transform-duration, 1s);
	}
	div {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
