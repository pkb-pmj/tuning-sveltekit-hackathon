import { browser } from '$app/environment';
import { writable, type Readable } from 'svelte/store';

const keyLabelsEn = [
	'C',
	'C♯ D♭',
	'D',
	'D♯ E♭',
	'E',
	'F',
	'F♯ G♭',
	'G',
	'G♯ A♭',
	'A',
	'A♯ B♭',
	'B',
];
const keyLabelsPl = [
	'C',
	'Cis Des',
	'D',
	'Dis Es',
	'E',
	'F',
	'Fis Ges',
	'G',
	'Gis As',
	'A',
	'Ais B',
	'H',
];

const keyCodes = 'AWSEDFTGYHUJ';
const codeToKey = Object.fromEntries(keyCodes.split('').map((char, i) => [`Key${char}`, i]));

export interface Key {
	label: string;
	pressed: boolean;
}

export type KeyboardStore = Readable<Key[]>;

export function keyboardStore() {
	const internal = keyLabelsEn.map((label) => ({ label, pressed: false }));

	const reset = () => internal.forEach((key) => (key.pressed = false));

	const { set, subscribe } = writable(internal, (set) => {
		if (browser) {
			window.addEventListener('keydown', onKeyDown);
			window.addEventListener('keyup', onKeyUp);
		}
		reset();
		set(internal);

		return () => {
			if (browser) {
				window.removeEventListener('keydown', onKeyDown);
				window.removeEventListener('keyup', onKeyUp);
			}
			reset();
			set(internal);
		};
	});

	const onKeyDown = (e: KeyboardEvent) => {
		if (codeToKey[e.code] === undefined) return;
		if (internal[codeToKey[e.code]].pressed) return;
		internal[codeToKey[e.code]].pressed = true;
		set(internal);
	};

	const onKeyUp = (e: KeyboardEvent) => {
		if (codeToKey[e.code] === undefined) return;
		internal[codeToKey[e.code]].pressed = false;
		set(internal);
	};

	return { subscribe };
}
