<script lang="ts">
	import type { Node } from './intervalTree';
	import { arc, circle, line, xy } from './utils';

	export let node: Node;
	export let current: Node;
	export let size: number;

	$: active = current === node;

	const activate = () => (current = node);

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
