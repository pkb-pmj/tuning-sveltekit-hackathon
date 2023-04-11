<svelte:options namespace="http://www.w3.org/1998/Math/MathML" />

<script lang="ts">
	import type { Interval } from './interval';

	export let interval: Interval;
	export let vertical = false;
	export let display: 'block' | 'inline' = 'inline';

	$: ({ rational, irrational } = interval.mathML());
	$: num = irrational.filter(({ exp }) => exp.s === 1);
	$: den = irrational.filter(({ exp }) => exp.s === -1);
</script>

<math {display}>
	{#if rational.d === 1 && irrational.length === 0}
		<mn>{rational.n}</mn>
	{:else if vertical}
		{#if rational.d === 1 && den.length === 0}
			{#if rational.n !== 1 || num.length === 0}
				<mn>{rational.n}</mn>
			{/if}
			{#each num as { base, exp }}
				<mroot>
					<mn>{base ** exp.n}</mn>
					<mn>{exp.d}</mn>
				</mroot>
			{/each}
		{:else}
			<mfrac>
				<mrow>
					{#if rational.n !== 1 || num.length === 0}
						<mn>{rational.n}</mn>
					{/if}
					{#each num as { base, exp }}
						<mroot>
							<mn>{base ** exp.n}</mn>
							<mn>{exp.d}</mn>
						</mroot>
					{/each}
				</mrow>
				<mrow>
					{#if rational.d !== 1}
						<mn>{rational.d}</mn>
					{/if}
					{#each den as { base, exp }}
						<mroot>
							<mn>{base ** exp.n}</mn>
							<mn>{exp.d}</mn>
						</mroot>
					{/each}
				</mrow>
			</mfrac>
		{/if}
	{:else}
		{#if rational.n !== 1 || num.length === 0}
			<mn>{rational.n}</mn>
		{/if}
		{#each num as { base, exp }}
			<mroot>
				<mn>{base ** exp.n}</mn>
				<mn>{exp.d}</mn>
			</mroot>
		{/each}
		{#if rational.d !== 1 || den.length > 0}
			<mo>/</mo>
		{/if}
		{#if rational.d !== 1}
			<mn>{rational.d}</mn>
		{/if}
		{#each den as { base, exp }}
			<mroot>
				<mn>{base ** exp.n}</mn>
				<mn>{exp.d}</mn>
			</mroot>
		{/each}
	{/if}
</math>
