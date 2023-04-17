<script lang="ts">
	import type { Key } from '$lib/keyboard';

	export let column: number = 0;
	export let key: Key;

	let div: HTMLDivElement;

	function press(event: PointerEvent) {
		div.releasePointerCapture(event.pointerId);
		if (event.buttons & 1) {
			key.clicked = true;
		}
	}
	function release() {
		key.clicked = false;
	}
</script>

<div
	bind:this={div}
	on:pointerdown={press}
	on:pointerup={release}
	on:pointerenter={press}
	on:pointerleave={release}
	on:pointercancel={release}
	style:grid-column-start={column}
	class={column ? 'white' : 'black'}
	class:pressed={key.pressed || key.clicked}
>
	<span>{key.label}</span>
	<span>{key.code}</span>
</div>

<style>
	div {
		display: flex;
		flex-flow: column;
		justify-content: end;
		align-items: center;
		padding-bottom: 0.6em;
		transition: background-color 0.1s;
		pointer-events: all;
	}
	span {
		display: block;
		flex: 0 0 min-content;
		font-size: 1.2em;
		font-family: sans-serif;
		text-align: center;
		line-height: 1.2em;
	}
	span:last-child {
		color: #888;
		font-size: 0.9em;
	}
	.white span {
		font-size: 1.6em;
	}
	.white span:last-child {
		color: #888;
		font-size: 1.2em;
	}
	.white {
		grid-row: 1 / -1;
		grid-column-end: span 1;
		z-index: 0;
		border-bottom-left-radius: var(--radius);
		border-bottom-right-radius: var(--radius);
		background-color: #fff;
		color: #000;
	}
	.white.pressed {
		background-color: #afa;
	}
	.white:first-child {
		border-top-left-radius: var(--radius);
	}
	.white:nth-child(7) {
		border-top-right-radius: var(--radius);
	}
	.black {
		border-bottom-left-radius: var(--radius);
		border-bottom-right-radius: var(--radius);
		background-color: #111;
		color: #fff;
	}
	.black.pressed {
		background-color: #161;
	}
	@media (hover: hover) {
		.white:hover {
			background-color: #afa;
		}
		.black:hover {
			background-color: #161;
		}
	}
</style>
