<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Readable } from 'svelte/store';

	export let frequencies: Readable<number[]>;

	let div: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let canvasCtx: CanvasRenderingContext2D;

	onMount(() => {
		canvasCtx = canvas.getContext('2d')!;
		canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

		const observer = new ResizeObserver(([div]) => {
			const width = div.contentRect.width;
			canvas.width = width;

			while (targetWaveform.length < width) {
				currentWaveform.push(0);
				targetWaveform.push(0);
			}
			while (targetWaveform.length > width) {
				currentWaveform.pop();
				targetWaveform.pop();
			}

			updateWaveform($frequencies);
		});
		observer.observe(div);

		animate();

		return () => {
			observer.disconnect();
		};
	});

	$: canvas && updateWaveform($frequencies);

	const pixelsPerSecond = 10000;
	const currentWaveform: number[] = [];
	const targetWaveform: number[] = [];

	function updateWaveform(frequencies: number[]) {
		const amplitude = 0.8 / frequencies.length;

		for (let i = 0; i < targetWaveform.length; i++) {
			const t = i / pixelsPerSecond;
			let y = 0;
			for (const frequency of frequencies) {
				y += amplitude * Math.cos(2 * Math.PI * frequency * t);
			}
			targetWaveform[i] = y;
		}
	}

	function drawWaveform() {
		canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
		canvasCtx.beginPath();
		canvasCtx.moveTo(0, canvas.height / 2);

		for (let i = 0; i < targetWaveform.length; i++) {
			canvasCtx.lineTo(i, canvas.height / 2 - (currentWaveform[i] * canvas.height) / 2);
			currentWaveform[i] = interpolate(currentWaveform[i], targetWaveform[i]);
			if ($frequencies.length > 0) {
				currentWaveform[i] += (Math.random() - 0.5) * 0.06;
			}
		}

		canvasCtx.strokeStyle = 'black';
		canvasCtx.lineWidth = 2;
		canvasCtx.stroke();
	}

	function interpolate(current: number, target: number): number {
		return target + (current - target) * 0.5;
	}

	let animate = () => {
		if (!canvas) return;
		drawWaveform();
		requestAnimationFrame(animate);
	};
</script>

<div bind:this={div} />
<canvas bind:this={canvas} />
