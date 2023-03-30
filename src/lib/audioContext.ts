import { browser } from '$app/environment';

// live `let` binding - https://stackoverflow.com/a/32558929
export let audioContext: AudioContext;

if (browser) {
	audioContext = new AudioContext();
	window.addEventListener('pointermove', () => audioContext.resume(), { once: true });
}
