<script lang="ts">
	import type { Node } from './intervalTree';

	export let node: Node;
	export let current: Node;

	const x = (angle: number) => Math.sin(angle);
	const y = (angle: number) => -Math.cos(angle);
	const rad = (deg: number) => (Math.PI / 180) * deg;
	const deg = (deg: number) => (180 / Math.PI) * deg;
	const pc = (val: number) => `${val * 50}%`;

	const circle = (angle: number, r: number) => ({
		cx: pc(r * x(angle)),
		cy: pc(r * y(angle)),
	});

	const line = (angle: number, r1: number, r2: number) => ({
		x1: pc(r1 * x(angle)),
		y1: pc(r1 * y(angle)),
		x2: pc(r2 * x(angle)),
		y2: pc(r2 * y(angle)),
	});

	const xy = (angle: number, r: number) => ({
		x: pc(r * x(angle)),
		y: pc(r * y(angle)),
	});

	$: angle = Math.PI * 2 * node.absInterval().log2valueOf();
</script>

<line {...line(angle, 0, 0.7)} />
<circle
	{...circle(angle, 0.7)}
	r="10"
	on:click={() => (current = node)}
	class:active={current === node}
/>
<foreignObject {...xy(angle, 0.6)}>
	<span>{node.absInterval().valueOf()}</span>
</foreignObject>

<style>
	line {
		stroke: black;
		stroke-width: 1px;
	}
	.active {
		fill: green;
	}
	foreignObject {
		width: 2em;
		height: 1em;
		transform: translate(-1em, -0.5em);
	}
</style>
