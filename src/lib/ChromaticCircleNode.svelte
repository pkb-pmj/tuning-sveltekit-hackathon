<script lang="ts">
	import type { Node } from './intervalTree';

	export let node: Node;
	export let current: Node;

	$: active = current === node;

	const activate = () => (current = node);

	$: absAngle = Math.PI * 2 * node.absInterval().log2valueOf();
	$: relAngle = Math.PI * 2 * node.getInterval().log2valueOf();

	const TWO_PI = Math.PI * 2;
	$: delta = Math.abs(relAngle);
	$: start = absAngle - (relAngle > 0 ? delta : 0) - TWO_PI / 4;
	$: radius = ((start + TWO_PI) % TWO_PI) * 10;
	$: dashArray = `${delta} ${TWO_PI - delta}`;
	$: midpoint = start + delta / 2;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<g class="wrapper" on:click={activate} class:active>
	<g class="transform" style:transform="rotate({absAngle}rad)">
		<line x1="0" y1="0" x2="0" y2="-74" />
		<line x1="0" y1="-86" x2="0" y2="-92" />
		<circle cx="0" cy="-80" r="6" />
		<text style:transform="translate(0, -80px) rotate({-absAngle}rad)" class="transform">
			{node.absInterval().valueOf()}
		</text>
	</g>
	<circle
		class="arc"
		cx="0"
		cy="0"
		r={radius}
		pathLength={TWO_PI}
		stroke-dasharray={dashArray}
		style:transform="rotate({start}rad)"
	/>
	<text
		class="interval transform"
		style:transform="rotate({midpoint}rad) translate({radius}px) rotate({-midpoint}rad)"
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
