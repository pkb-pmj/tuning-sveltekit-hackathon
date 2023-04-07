<script lang="ts">
	import type { Interval } from './interval';

	export let start: Interval;
	export let delta: Interval;
	export let radius: number;

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
<text style:transform="rotate({midpoint}turn) translate({radius}px) rotate(90deg)">
	{delta.abs().frac()}
</text>

<style>
	circle {
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
</style>
