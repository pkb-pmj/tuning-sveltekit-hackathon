<script lang="ts">
	import type { Node } from './intervalTree';
	import type { KeyboardStore } from './keyboard';
	import SoundGenerator from './SoundGenerator.svelte';

	export let node: Node;
	export let current: Node;
	export let keyboard: KeyboardStore;

	$: active = current === node;

	const activate = () => (current = node);

	$: absAngle = node.absInterval().log2valueOf();
	$: relAngle = node.getInterval().log2valueOf();

	$: delta = Math.abs(relAngle);
	$: start = absAngle - (relAngle > 0 ? delta : 0) - 1 / 4;
	$: radius = ((start + 1) % 1) * 60;
	$: dashArray = `${delta} ${1 - delta}`;
	$: midpoint = start + delta / 2;

	$: frequency = node.absInterval().normalized().valueOf() * 256;
	$: keyIndex = Math.round(node.absInterval().normalized().log2valueOf() * 12 + 12) % 12;
</script>

{#if $keyboard[keyIndex].pressed}
	<SoundGenerator {frequency} />
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<g class="wrapper" on:click={activate} class:active>
	<g class="transform" style:transform="rotate({absAngle}turn)">
		<line x1="0" y1="0" x2="0" y2="-74" />
		<line x1="0" y1="-86" x2="0" y2="-92" />
		<circle cx="0" cy="-80" r="6" />
		<text style:transform="translate(0, -80px) rotate({-absAngle}turn)" class="transform">
			{node.absInterval().normalized().valueOf()}
		</text>
	</g>
	<circle
		class="arc"
		cx="0"
		cy="0"
		r={radius}
		pathLength={1}
		stroke-dasharray={dashArray}
		style:transform="rotate({start}turn)"
	/>
	<text
		class="interval transform"
		style:transform="rotate({midpoint}turn) translate({radius}px) rotate({-midpoint}turn)"
	>
		{node.getInterval().valueOf()}
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
		transition: stroke 0.1s, transform 1s, stroke-dasharray 1s, r 1s;
	}
	text {
		font-size: 4px;
		text-anchor: middle;
		dominant-baseline: middle;
	}
</style>
