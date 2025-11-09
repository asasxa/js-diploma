export default class GameStateService {
	constructor(storage) {
		this.storage = storage;
	}

	save(state) {
		this.storage.setItem('gameState', JSON.stringify(state));
	}

	load() {
		try {
			return JSON.parse(this.storage.getItem('gameState'));
		} catch (e) {
			throw new Error('Invalid state');
		}
	}
}
