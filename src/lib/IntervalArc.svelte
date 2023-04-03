<script lang="ts">
	import type { Interval } from './interval';

	export let start: Interval;
	export let delta: Interval;
	export let radius: number;

	$: startAngle = start.log2valueOf() - 1 / 4;
	$: deltaAngle = delta.log2valueOf();
	$: midpoint = startAngle + deltaAngle / 2;
</script>

<g>
	<circle
		class="arc"
		cx="0"
		cy="0"
		r={radius}
		pathLength={1}
		stroke-dasharray="1"
		stroke-dashoffset={1 - deltaAngle}
		style:transform="rotate({startAngle}turn)"
	/>
	<text
		class="interval transform"
		style:transform="rotate({midpoint}turn) translate({radius}px) rotate(90deg)"
	>
		{delta.frac()}
	</text>
</g>

<style>
	circle.arc {
		stroke: red;
		stroke-width: 5px;
		fill: none;
		opacity: 0.2;
	}
	g:nth-child(2n) circle.arc {
		stroke: blue;
	}
	g:last-child:not(:nth-child(2n)) circle.arc {
		stroke: green;
	}
	text {
		font-size: 4px;
		text-anchor: middle;
		dominant-baseline: middle;
	}
</style>
