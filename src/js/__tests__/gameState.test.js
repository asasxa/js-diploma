import GameState from '../GameState';

test('attack', () => {
	const received = GameState.calcPossibleCellsAttack(20, 8, 1);
	const expected = [11, 12, 13, 19, 21, 27, 28, 29];

	expect(received).toEqual(expected);
});

test('left && top attack greater than maximum', () => {
	const received = GameState.calcPossibleCellsAttack(9, 8, 4);
	const expected = [
		0, 	1, 	2, 	3, 	4, 	5,
		8, 			10,	11,	12,	13,
		16, 17, 18, 19, 20,	21,
		24, 25, 26, 27, 28, 29,
		32, 33, 34, 35, 36, 37,
		40, 41, 42, 43, 44, 45,
	];

	expect(received).toEqual(expected);
});

test('right && down attack greater than maximum', () => {
	const received = GameState.calcPossibleCellsAttack(63, 8, 2);
	const expected = [
		45,	46,	47,
		53,	54,	55,
		61,	62,
	];

	expect(received).toEqual(expected);
});

test('create object', () => {
	const received = new GameState();
	const expected = {
		activeMove: 'player',
		playerLvl: 1,
		points: 0,
		historyPoints: [],

		activeCharacter: false,
		possibleAttackRange: [],
		possibleMoveRange: [],
	};

	expect(received).toEqual(expected);
});

test('move', () => {
	const received = GameState.calcPossibleCellsMove(20, 8, 1);
	const expected = [11, 12, 13, 19, 21, 27, 28, 29];

	expect(received).toEqual(expected);
});

test('left && top move greater than maximum', () => {
	const received = GameState.calcPossibleCellsMove(9, 8, 4);
	const expected = [
		0,	1,	2,
		8,			10,	11,	12,	13,
		16,	17,	18,
		25,			27,
		33,					36,
		41,							45,
	];

	expect(received).toEqual(expected);
});

test('right && down move greater than maximum', () => {
	const received = GameState.calcPossibleCellsMove(63, 8, 2);
	const expected = [
		45,					47,
		54,	55,
		61,	62,
	];

	expect(received).toEqual(expected);
});
