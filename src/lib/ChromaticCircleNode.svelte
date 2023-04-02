<script lang="ts">
	import type { Node } from './intervalTree';
	import type { KeyboardStore } from './keyboard';
	import SoundGenerator from './SoundGenerator.svelte';

	export let node: Node;
	export let current: Node;
	export let keyboard: KeyboardStore;
	export let i: number;

	$: active = current === node;

	const activate = () => (current = node);

	$: absAngle = node.absInterval().log2valueOf();
	$: relAngle = node.getInterval().log2valueOf();

	$: start = absAngle - relAngle - 1 / 4;
	$: midpoint = start + relAngle / 2;
	$: radius = (12 - i) * 5;

	$: frequency = node.absInterval().normalized().valueOf() * 256;
	$: keyIndex = Math.round(node.absInterval().normalized().log2valueOf() * 12 + 12) % 12;
</script>

{#if $keyboard[keyIndex].pressed}
	<SoundGenerator {frequency} />
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<g class="wrapper" on:click={activate} class:active>
	<g class="transform" style:transform="rotate({absAngle}turn)">
		<line x1="0" y1="0" x2="0" y2="-68" />
		<line x1="0" y1="-80" x2="0" y2="-84" />
		<circle cx="0" cy="-74" r="6" />
		<text style:transform="translate(0, -74px) rotate({-absAngle}turn)" class="transform">
			{node.absInterval().normalized().frac()}
		</text>
	</g>
	<circle
		class="arc"
		cx="0"
		cy="0"
		r={radius}
		pathLength={1}
		stroke-dasharray="1"
		stroke-dashoffset={1 - relAngle}
		style:transform="rotate({start}turn)"
	/>
	<text
		class="interval transform"
		style:transform="rotate({midpoint}turn) translate({radius}px) rotate(90deg)"
	>
		{node.getInterval().frac()}
	</text>
</g>

<style>
	g.wrapper {
		--color: #04f4;
	}
	g.wrapper:hover {
		--color: #04fa;
	}
	g.wrapper.active {
		--color: #0c04;
	}
	g.wrapper.active:hover {
		--color: #0c0a;
	}
	.transform {
		transition: transform 1s;
	}
	line {
		stroke: black;
		stroke-width: 0.4px;
	}
	circle {
		stroke: black;
		stroke-width: 0.4px;
		fill: var(--color);
		transition: fill 0.1s;
	}
	circle.arc {
		stroke: var(--color);
		stroke-width: 4px;
		fill: none;
		transition: stroke 0.1s, transform 1s, stroke-dashoffset 1s, r 1s;
	}
	text {
		font-size: 4px;
		text-anchor: middle;
		dominant-baseline: middle;
	}
</style>
