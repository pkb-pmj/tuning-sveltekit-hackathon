<script lang="ts">
	import { Interval } from './interval';
	import type { Node } from './intervalTree';

	export let node: Node;

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

	let interval: string;
</script>

<line {...line(angle, 0, 70)} />
<circle {...circle(angle, 70)} r="10" />
<foreignObject {...xy(angle + rad(10), 70)}>
	<span>{node.absInterval().valueOf()}</span>
	<input type="text" bind:value={interval} />
	<button on:click={() => node.addChild(new Interval(interval))}>Add child</button>
	<button on:click={() => node.updateInterval(new Interval(interval))}>Update interval</button>
	<button on:click={() => node.removeSelf()}>Remove</button>
</foreignObject>

<style>
	line {
		stroke: black;
		stroke-width: 1px;
	}
	foreignObject {
		width: 30px;
		height: 20px;
	}
</style>
