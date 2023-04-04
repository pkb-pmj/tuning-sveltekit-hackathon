<script lang="ts">
	import type { KeyboardStore } from './keyboard';

	export let labels: string[];
	export let keyboard: KeyboardStore;

	labels = labels.map((label) => label.replace(' ', ' / '));
</script>

{#each labels as label, i}
	<g class:playing={$keyboard[i].pressed}>
		<circle r="92" pathLength="24" style:transform="rotate({i / 12}turn)" />
		<text style:transform="rotate({i / 12}turn) translate(0, -95px)">{label}</text>
	</g>
{/each}

<style>
	circle {
		stroke-dasharray: 0 17 2 5;
		fill: none;
		stroke: #f00;
		stroke-width: 16px;
		opacity: 0.1;
		transition: opacity 0.2s;
	}
	g:nth-child(2n) circle {
		stroke: #00f;
	}
	g:hover circle,
	g.playing circle {
		opacity: 0.2;
	}
	text {
		font-size: 5px;
		text-anchor: middle;
		dominant-baseline: middle;
	}
</style>
