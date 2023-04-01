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
	$: r = absAngle / 8;
	$: d = arc(absAngle, -relAngle, (r * size) / 2);
</script>

<g on:click={activate} class:active>
	<line {...line(absAngle, 0, 0.74)} />
	<line {...line(absAngle, 0.86, 0.92)} />
	<circle {...circle(absAngle, 0.8)} r="3%" />
	<path class="arc" {d} />
	<text class="interval" {...xy(absAngle - relAngle / 2, r)}>{node.getInterval().valueOf()}</text>
	<text class="valueOf" {...xy(absAngle, 0.8)}>{node.absInterval().valueOf()}</text>
</g>

<style>
	g {
		--color: #04f4;
	}
	g:hover {
		--color: #04fa;
	}
	g.active {
		--color: #0c04;
	}
	g.active:hover {
		--color: #0c0a;
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
		stroke-width: 1em;
		fill: none;
		transition: stroke 0.1s;
	}
	text {
		text-anchor: middle;
		dominant-baseline: middle;
	}
</style>
