<script lang="ts">
	export let i: number;

	const angle = (i * 360) / 1200;
	const weight = i % 100 === 0 ? 'm100' : i % 50 === 0 ? 'm50' : i % 10 === 0 ? 'm10' : 'm1';
	const length = {
		m1: 2,
		m10: 3,
		m50: 4,
		m100: 4,
	}[weight];
</script>

<line class={weight} style:--angle="{angle}deg" x1="0" y1={length - 92} x2="0" y2="-92" />
{#if weight === 'm100'}
	<text style:--angle="{angle}deg">{i}</text>
{/if}

<style>
	line {
		stroke: black;
		transform: rotate(var(--angle));
	}
	.m100 {
		stroke-width: 0.4px;
	}
	.m50 {
		stroke-width: 0.4px;
	}
	.m10 {
		stroke-width: 0.2px;
	}
	.m1 {
		stroke-width: 0.2px;
	}
	text {
		transform: rotate(var(--angle)) translate(0, -87px);
		font-size: 4px;
		text-anchor: middle;
		dominant-baseline: hanging;
	}
</style>
