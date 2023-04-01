<script lang="ts">
	import { line, rad, xy } from './utils';

	export let i: number;

	const angle = rad((i * 360) / 1200);
</script>

{#if i % 100 === 0}
	<line class="m100" {...line(angle, 0.88, 0.92)} />
	<text {...xy(angle, 0.84)}>{i}</text>
{:else if i % 50 === 0}
	<line class="m50" {...line(angle, 0.88, 0.92)} />
{:else if i % 10 === 0}
	<line class="m10" {...line(angle, 0.89, 0.92)} />
{:else}
	<line class="m1" {...line(angle, 0.9, 0.92)} />
{/if}

<style>
	line {
		stroke: black;
	}
	.m100 {
		stroke-width: 1px;
	}
	.m10 {
		stroke-width: 1px;
	}
	.m10 {
		stroke-width: 0.5px;
	}
	.m1 {
		stroke-width: 0.5px;
	}
	text {
		text-anchor: middle;
		dominant-baseline: middle;
	}
</style>
