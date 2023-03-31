<script lang="ts">
	import type { Node } from './intervalTree';

	export let node: Node;
	export let current: Node;

	const x = (angle: number) => Math.sin(angle);
	const y = (angle: number) => -Math.cos(angle);
	const rad = (deg: number) => (Math.PI / 180) * deg;
	const deg = (deg: number) => (180 / Math.PI) * deg;

	const circle = (angle: number, r: number) => ({
		cx: r * x(angle),
		cy: r * y(angle),
	});

	const line = (angle: number, r1: number, r2: number) => ({
		x1: r1 * x(angle),
		y1: r1 * y(angle),
		x2: r2 * x(angle),
		y2: r2 * y(angle),
	});

	const xy = (angle: number, r: number) => ({
		x: r * x(angle),
		y: r * y(angle),
	});

	$: angle = Math.PI * 2 * node.absInterval().log2valueOf();
</script>

<line {...line(angle, 0, 70)} />
<circle
	{...circle(angle, 70)}
	r="10"
	on:click={() => (current = node)}
	class:active={current === node}
/>
<foreignObject {...xy(angle, 40)}>
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
		width: 30px;
		height: 20px;
		transform: translate(-15px, -10px);
	}
</style>
