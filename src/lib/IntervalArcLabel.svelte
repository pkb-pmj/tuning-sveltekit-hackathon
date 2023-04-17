<script lang="ts">
	export let angle: number;
	export let radius: number;
</script>

<foreignObject
	width="200px"
	height="20px"
	font-size="14px"
	style:transform="rotate({angle}turn) translate({radius}px) rotate(90deg) translate(-30px, -2.5px)
	scale(0.3)"
>
	<div>
		<slot />
	</div>
</foreignObject>

<style>
	foreignObject {
		pointer-events: none;
		transition: transform var(--transform-duration, 1s);
	}
	div {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
