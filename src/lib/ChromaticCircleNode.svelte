<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';
	import IntervalArc from './IntervalArc.svelte';
	import type { Node } from './intervalTree';
	import SoundGenerator from './SoundGenerator.svelte';
	import IntervalMathMl from './IntervalMathML.svelte';
	import CompoundIntervalArc from './CompoundIntervalArc.svelte';

	export let node: Node;
	export let playing: Readable<Node[]>;
	export let selected: Writable<Node[]>;

	function onClick(event: MouseEvent) {
		if (event.shiftKey) {
			const index = $selected.indexOf(node);
			if (index === -1) $selected.push(node);
			else $selected.splice(index, 1);
			$selected = $selected;
		} else {
			$selected = [node];
		}
	}

	$: parentInterval = node.absInterval.sub(node.relInterval);

	$: absAngle = node.absInterval.log2valueOf();
	$: innerRadius = node.index * 5;
	$: width = (node.numDescendants + 1) * 5 - 1;
	$: midRadius = innerRadius + width / 2;

	$: frequency = node.absInterval.modUnsigned().valueOf() * 256;
	$: isPlaying = $playing.indexOf(node) !== -1;
	$: isSelected = $selected.includes(node);
</script>

{#if isPlaying}
	<SoundGenerator {frequency} />
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<g class="wrapper" on:click|stopPropagation={onClick} class:isPlaying class:isSelected>
	<g class="transform" style:transform="rotate({absAngle}turn)">
		<line x1="0" y1="0" x2="0" y2="-{innerRadius}" class="transparent" />
		<line x1="0" y1="-{innerRadius}" x2="0" y2="-68" />
		<line x1="0" y1="-80" x2="0" y2="-84" />
		<circle class="note" cx="0" cy="-74" r="6" />
		<foreignObject
			width="100px"
			height="50px"
			font-size="16px"
			style:transform="translate(0, -74px) rotate({-absAngle}turn) translate(-15px, -7.5px)
			scale(0.3)"
		>
			<div>
				<IntervalMathMl interval={node.absInterval.modUnsigned()} vertical />
			</div>
		</foreignObject>
	</g>
	<g class="arc">
		<circle class="wide-arc" cx="0" cy="0" r={midRadius} stroke-width={width} />
		<CompoundIntervalArc start={parentInterval} delta={node.relInterval} radius={innerRadius + 2} />
	</g>
</g>

<style>
	g.wrapper {
		--color: blue;
		--opacity: 0.2;
	}
	g.wrapper.isPlaying {
		--color: yellow;
	}
	g.wrapper.isSelected {
		--color: green;
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
	line.transparent {
		stroke-dasharray: 2.5;
		stroke-dashoffset: -0.75;
		opacity: 0.4;
	}
	.note {
		stroke: black;
		stroke-width: 0.4px;
		fill: var(--color);
		fill-opacity: var(--opacity);
		transition: fill 0.1s, fill-opacity 0.1s;
	}
	foreignObject {
		transition: transform var(--transform-duration, 1s);
	}
	div {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.wide-arc {
		--opacity: 0;
		fill: none;
		stroke: var(--color);
		stroke-opacity: var(--opacity);
		transition: stroke 0.1s, stroke-opacity 0.1s;
		pointer-events: none;
	}
	g.wrapper:hover .wide-arc {
		--opacity: 0.1;
	}
</style>
