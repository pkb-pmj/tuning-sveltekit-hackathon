<script lang="ts">
	import { setContext } from 'svelte';
	import type { IntervalTree, Node } from '$lib/intervalTree';
	import { temperaments } from './data';

	export let tree: IntervalTree;
	export let root: Node;

	setContext('root', root);
	setContext('intervalTree', tree);

	let temperament = 0;
	let step = 0;

	$: setTree(step);
	$: temperament, (step = -1);

	function setTree(step: number) {
		if (step === -1) return;
		root.updateFromJSON(temperaments[temperament].steps[step].data);
		tree.update();
	}
</script>

<ul>
	{#each temperaments as { name }, i}
		<li class:checked={temperament === i}>
			<input type="radio" hidden value={i} id="t{i}" bind:group={temperament} />
			<label for="t{i}">{name}</label>
		</li>
	{/each}
</ul>
<div class="list">
	<ol>
		{#each temperaments[temperament].steps as { text, data }, i}
			<li class:checked={step === i}>
				<input type="radio" hidden value={i} id="s{i}" bind:group={step} />
				<label for="s{i}">{text}</label>
			</li>
		{/each}
	</ol>
</div>

<style>
	ul {
		list-style-type: none;
		display: flex;
		flex-flow: column nowrap;
		gap: 0.5em;
		margin: 0;
		padding: 0;
	}
	ol {
		list-style-position: inside;
		display: flex;
		flex-flow: column nowrap;
		gap: 0.5em;
		margin: 0;
		margin-top: 0.5em;
		padding: 0.5em;
		border-radius: 0.5em;
		background-color: #eee;
		--saturation: 0%;
		--value: 100%;
		--alpha: 1;
	}
	li {
		cursor: pointer;
		padding: 0.5em;
		border-radius: 0.5em;
		transition: 0.2s background-color;
		background-color: hsl(var(--hue) var(--saturation) var(--value) / var(--alpha));
	}
	ul li {
		display: block;
	}
	label {
		cursor: pointer;
	}
	ul label {
		display: block;
		text-align: center;
	}
	li:hover {
		--hue: 120;
		--saturation: 80%;
		--value: 80%;
	}
	li.checked {
		--hue: 0;
		--hue: 120;
		--hue: 220;
		--hue: 220;
		--saturation: 80%;
		--value: 80%;
		--alpha: 0.4;
	}
	li:hover {
		--alpha: 0.6;
	}
</style>
