<script lang="ts">
	import type { Node } from './intervalTree';

	export let node: Node;
	export let current: Node;
	export let size: number;

	$: active = current === node;

	const activate = () => (current = node);

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

	const arc = (start: number, angle: number, r: number) => {
		const end = start + angle;
		const largeArc = Math.abs(angle) > Math.PI ? 1 : 0;
		const sweep = angle > 0 ? 1 : 0;
		const move = `M ${x(start) * r} ${y(start) * r}`;
		// rx ry angle large-arc-flag sweep-flag x y
		const arc = `A ${r} ${r} 0 ${largeArc} ${sweep} ${x(end) * r} ${y(end) * r}`;
		return `${move} ${arc}`;
	};

	$: absAngle = Math.PI * 2 * node.absInterval().log2valueOf();
	$: relAngle = Math.PI * 2 * node.getInterval().log2valueOf();
	$: d = arc(absAngle, -relAngle, ((absAngle / 8) * size) / 2);
</script>

<g on:click={activate} class:active>
	<line {...line(absAngle, 0, 0.7)} />
	<circle {...circle(absAngle, 0.76)} r="3%" />
	<path class="arc" {d} />
	<foreignObject class="valueOf" {...xy(absAngle, 0.6)}>
		<span>{node.absInterval().valueOf()}</span>
	</foreignObject>
</g>

<style>
	g {
		--color: #0c04;
	}
	g:hover {
		--color: #0c0a;
	}
	g.active {
		--color: #04f4;
	}
	g.active:hover {
		--color: #04fa;
	}
	line {
		stroke: black;
		stroke-width: 1px;
	}
	circle {
		stroke: black;
		stroke-width: 1px;
		fill: var(--color);
		transition: fill 0.1s;
	}
	.arc {
		stroke: var(--color);
		stroke-width: 0.5em;
		fill: none;
		transition: stroke 0.1s;
	}
	foreignObject {
		width: var(--width);
		height: var(--height);
		translate: calc(var(--width) / -2) calc(var(--height) / -2);
	}
	.valueOf {
		--width: 2em;
		--height: 1em;
	}
	.add,
	.remove {
		--width: 1.2em;
		--height: 1.2em;
	}
</style>
