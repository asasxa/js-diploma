import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import GameController from '../GameController';

test('show message in cell with character', () => {
	const gamePlay = new GamePlay();
	const stateService = new GameStateService();
	const gameCtrl = new GameController(gamePlay, stateService);

	gameCtrl.gamePlay.cells = [
		{
			title: '',
		},
	];

	gameCtrl.positions = [
		{
			character: {
				level: 3,
				attack: 25,
				defence: 25,
				health: 50,
				type: 'undead',
			},
			position: 5,
		},
	];

	gameCtrl.createMessage(
		{
			level: 3,
			attack: 25,
			defence: 25,
			health: 50,
			type: 'undead',
		},
		0,
	);

	const received = gameCtrl.gamePlay.cells[0].title;
	const expected = '\u{1F396} 3 \u{2764} 50 \u{2694} 25 \u{1F6E1} 25';

	expect(received).toBe(expected);
});

test('clear message from cell', () => {
	const gamePlay = new GamePlay();
	const stateService = new GameStateService();
	const gameCtrl = new GameController(gamePlay, stateService);

	gameCtrl.gamePlay.cells = [
		{
			title: 'testing messasge',
			classList: {
				remove() {
				},
			},
		},
	];
	gameCtrl.gamePlay.boardEl = {
		style: {
			cursor: 'pointer',
		},
	};

	gameCtrl.onCellLeave(0);

	const received = gameCtrl.gamePlay.cells[0].title;
	const expected = '';

	expect(received).toBe(expected);
});
