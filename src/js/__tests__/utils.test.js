import { calcTileType } from '../utils';

test('arg dont number', () => {
	const received = () => calcTileType('5', '');
	const expected = new Error('Указано не число!');

	expect(received).toThrow(expected);
});

test('uncorrect index (big)', () => {
	const received = () => calcTileType(20, 4);
	const expected = new Error('Неверный индекс');

	expect(received).toThrow(expected);
});

test('return top-left', () => {
	const received = calcTileType(0, 4);
	const expected = 'top-left';

	expect(received).toBe(expected);
});

test('return top-right', () => {
	const received = calcTileType(3, 4);
	const expected = 'top-right';

	expect(received).toBe(expected);
});

test('return bottom-right', () => {
	const received = calcTileType(24, 5);
	const expected = 'bottom-right';

	expect(received).toBe(expected);
});

test('return bottom-left', () => {
	const received = calcTileType(20, 5);
	const expected = 'bottom-left';

	expect(received).toBe(expected);
});

test('return top', () => {
	const received = calcTileType(2, 5);
	const expected = 'top';

	expect(received).toBe(expected);
});

test('return right', () => {
	const received = calcTileType(9, 5);
	const expected = 'right';

	expect(received).toBe(expected);
});

test('return bottom', () => {
	const received = calcTileType(23, 5);
	const expected = 'bottom';

	expect(received).toBe(expected);
});

test('return left', () => {
	const received = calcTileType(15, 5);
	const expected = 'left';

	expect(received).toBe(expected);
});

test('return center', () => {
	const received = calcTileType(17, 5);
	const expected = 'center';

	expect(received).toBe(expected);
});
