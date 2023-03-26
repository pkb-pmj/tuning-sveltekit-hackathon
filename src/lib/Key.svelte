<script lang="ts">
	import type { Key } from '$lib/keyboard';

	export let column: number = 0;
	export let key: Key;
</script>

<div
	style:grid-column-start={column}
	class={column ? 'white' : 'black'}
	class:pressed={key.pressed}
>
	<span>{key.label}</span>
</div>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: end;
		padding-bottom: 1em;
		transition: background-color 0.1s;
		pointer-events: all;
	}
	span {
		flex: 0 0 min-content;
		font-size: 1.6em;
		font-family: sans-serif;
	}
	.white span {
		font-size: 2em;
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
	.white:hover,
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
	.black:hover,
	.black.pressed {
		background-color: #161;
	}
</style>
