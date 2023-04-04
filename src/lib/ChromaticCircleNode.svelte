<script lang="ts">
	import type { Readable } from 'svelte/store';
	import IntervalArc from './IntervalArc.svelte';
	import type { Node } from './intervalTree';
	import SoundGenerator from './SoundGenerator.svelte';

	export let node: Node;
	export let current: Node;
	export let playing: Readable<Node[]>;
	export let i: number;

	$: active = current === node;

	const activate = () => (current = node);

	$: absInterval = node.absInterval();
	$: relInterval = node.getInterval();
	$: parentInterval = absInterval.sub(relInterval);

	$: absAngle = absInterval.log2valueOf();
	$: radius = (12 - i) * 5;

	$: frequency = node.absInterval().normalized().valueOf() * 256;
	$: isPlaying = $playing.indexOf(node) !== -1;
</script>

{#if isPlaying}
	<SoundGenerator {frequency} />
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<g class="wrapper" on:click={activate} class:active class:isPlaying>
	<g class="transform" style:transform="rotate({absAngle}turn)">
		<line x1="0" y1="0" x2="0" y2="-68" />
		<line x1="0" y1="-80" x2="0" y2="-84" />
		<circle cx="0" cy="-74" r="6" />
		<text style:transform="translate(0, -74px) rotate({-absAngle}turn)" class="transform">
			{absInterval.normalized().frac()}
		</text>
	</g>
	<g class="arc">
		<IntervalArc start={parentInterval} delta={relInterval} {radius} />
	</g>
</g>

<style>
	g.wrapper {
		--color: blue;
		--opacity: 0.2;
	}
	g.wrapper.active {
		--color: green;
	}
	g.wrapper.isPlaying {
		--color: yellow;
	}
	g.wrapper:hover {
		--opacity: 0.6;
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
		fill-opacity: var(--opacity);
		transition: fill 0.1s, fill-opacity 0.1s;
	}
	text {
		font-size: 4px;
		text-anchor: middle;
		dominant-baseline: middle;
	}
</style>
