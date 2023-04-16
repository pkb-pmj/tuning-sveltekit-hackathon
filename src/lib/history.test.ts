import { expect, test } from 'vitest';
import { AppHistory } from './history';

test('basic', () => {
	const history = new AppHistory(1);
	expect(history.current()).toStrictEqual(1);
	expect(history.backward()).toStrictEqual(1);
	expect(history.forward()).toStrictEqual(1);
});

test('forward-backward movement', () => {
	const history = new AppHistory(1);

	history.push(2);
	expect(history.current()).toStrictEqual(2);
	expect(history.forward()).toStrictEqual(2);
	expect(history.current()).toStrictEqual(2);

	expect(history.backward()).toStrictEqual(1);
	expect(history.current()).toStrictEqual(1);

	expect(history.forward()).toStrictEqual(2);
	expect(history.current()).toStrictEqual(2);

	history.push(3);
	expect(history.current()).toStrictEqual(3);
	expect(history.forward()).toStrictEqual(3);
	expect(history.current()).toStrictEqual(3);

	expect(history.backward()).toStrictEqual(2);
	expect(history.current()).toStrictEqual(2);
});

test('rewriting history', () => {
	const history = new AppHistory(1);
	expect(history.current()).toStrictEqual(1);
	expect(history.backward()).toStrictEqual(1);
	expect(history.forward()).toStrictEqual(1);

	history.push(2);
	history.push(3);
	history.backward();

	history.push(4);
	expect(history.current()).toStrictEqual(4);
	expect(history.forward()).toStrictEqual(4);
	expect(history.forward()).toStrictEqual(4);

	expect(history.backward()).toStrictEqual(2);
	expect(history.backward()).toStrictEqual(1);

	history.push(5);
	expect(history.current()).toStrictEqual(5);
	expect(history.forward()).toStrictEqual(5);
	expect(history.forward()).toStrictEqual(5);

	expect(history.backward()).toStrictEqual(1);
	expect(history.current()).toStrictEqual(1);
});
