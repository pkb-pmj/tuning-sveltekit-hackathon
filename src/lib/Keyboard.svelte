<script lang="ts">
	import Key from '$lib/Key.svelte';
	import type { KeyboardStore } from './keyboard';

	export let keyboard: KeyboardStore;
</script>

<div class="container">
	<Key column={1} key={$keyboard[0]} />
	<Key column={2} key={$keyboard[2]} />
	<Key column={3} key={$keyboard[4]} />
	<Key column={4} key={$keyboard[5]} />
	<Key column={5} key={$keyboard[7]} />
	<Key column={6} key={$keyboard[9]} />
	<Key column={7} key={$keyboard[11]} />
	<div class="black left">
		<Key key={$keyboard[1]} />
		<Key key={$keyboard[3]} />
	</div>
	<div class="black right">
		<Key key={$keyboard[6]} />
		<Key key={$keyboard[8]} />
		<Key key={$keyboard[10]} />
	</div>
</div>

<style>
	.container {
		background-color: #888;
		--gap: 0.4rem;
		--radius: 0.5rem;
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: 5fr 3fr;
		padding: var(--gap);
		column-gap: var(--gap);
		border-radius: calc(var(--radius) + var(--gap));
	}
	.black {
		grid-row: 1 / 2;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-evenly;
		align-items: stretch;
		z-index: 1;
		pointer-events: none;
	}
	.left {
		grid-column: 1 / span 3;
	}
	.right {
		grid-column: 4 / span 4;
	}
	.left > :global(*) {
		flex-basis: calc(110% / 5);
	}
	.right > :global(*) {
		flex-basis: calc(110% / 7);
	}
</style>
