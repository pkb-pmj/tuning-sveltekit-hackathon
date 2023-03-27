import { browser } from '$app/environment';

export const audioContext = new AudioContext();

if (browser) {
	window.addEventListener('pointermove', () => audioContext.resume(), { once: true });
}
