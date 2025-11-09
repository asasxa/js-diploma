import GameStateService from '../GameStateService';

jest.mock('../GameStateService.js');
beforeEach(() => {
	jest.resetAllMocks();
});

test('correce load state', () => {
	const stateService = new GameStateService();

	stateService.load.mockReturnValue({
		activeMove: 'player',
		playerLvl: 1,
		points: 0,
	});

	const expected = {
		activeMove: 'player',
		playerLvl: 1,
		points: 0,
	};
	expect(stateService.load()).toEqual(expected);
});

test('load with error', () => {
	const stateService = new GameStateService();

	stateService.load = jest.fn(() => {
		throw new Error('Invalid state');
	});

	expect(() => stateService.load()).toThrow(new Error('Invalid state'));
});
