import { calcHealthLevel, calcTileType } from './utils';

export default class GamePlay {
	constructor() {
		this.boardSize = 8;
		this.countCharacterTeam = 5;
		this.maxStartLvl = 3;
		this.maxPossibLvl = 999;
		this.container = null;
		this.boardEl = null;
		this.cells = [];
		this.cellClickListeners = [];
		this.cellEnterListeners = [];
		this.cellLeaveListeners = [];
		this.newGameListeners = [];
		this.saveGameListeners = [];
		this.loadGameListeners = [];
		this.cellMaxPoints = null;
		this.cellCurrentPoints = null;
		this.message = null;
	}

	bindToDOM(container) {
		if (!(container instanceof HTMLElement)) {
			throw new Error('container is not HTMLElement');
		}
		this.container = container;
	}

	/**
	 * Draws boardEl with specific theme
	 *
	 * @param theme
	 */
	drawUi(theme) {
		this.checkBinding();
		this.container.innerHTML = `
			<div class="controls">
				<button data-id="action-restart" class="btn">New Game</button>
				<button data-id="action-save" class="btn">Save Game</button>
				<button data-id="action-load" class="btn">Load Game</button>
			</div>
			<div class="points">
				<div data-id="points-current" class="points-pole">
					<span class="points-pole-descrip">Набрано очков: </span>
					<span data-id="points-current-value" class="points-pole-value"></span>
				</div>
				<div data-id="points-max" class="points-pole">
					<span class="points-pole-descrip">Максимум очков: </span>
					<span data-id="points-max-value" class="points-pole-value"></span>
				</div>
			</div>
			<div id-data="message" class="message hidden-item">
				Тут бубу показываться сообщения вместо алертов
			</div>
			<div class="board-container">
				<div data-id="board" class="board"></div>
			</div>
		`;

		this.newGameEl = this.container.querySelector('[data-id=action-restart]');
		this.saveGameEl = this.container.querySelector('[data-id=action-save]');
		this.loadGameEl = this.container.querySelector('[data-id=action-load]');

		this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
		this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
		this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));

		this.cellMaxPoints = this.container.querySelector('[data-id=points-max]');
		this.cellCurrentPoints = this.container.querySelector('[data-id=points-current]');

		this.boardEl = this.container.querySelector('[data-id=board]');

		this.boardEl.classList.add(theme);
		for (let i = 0; i < this.boardSize ** 2; i += 1) {
			const cellEl = document.createElement('div');
			cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
			cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
			cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
			cellEl.addEventListener('click', (event) => this.onCellClick(event));
			this.boardEl.appendChild(cellEl);
		}

		this.cells = Array.from(this.boardEl.children);
	}

	/**
	 * Draws positions (with chars) on boardEl
	 *
	 * @param positions array of PositionedCharacter objects
	 */
	redrawPositions(positions) {
		for (const cell of this.cells) {
			cell.innerHTML = '';
		}

		for (const position of positions) {
			const cellEl = this.boardEl.children[position.position];
			const charEl = document.createElement('div');
			charEl.classList.add('character', position.character.type);

			const healthEl = document.createElement('div');
			healthEl.classList.add('health-level');

			const healthIndicatorEl = document.createElement('div');
			healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
			healthIndicatorEl.style.width = `${position.character.health}%`;
			healthEl.appendChild(healthIndicatorEl);

			charEl.appendChild(healthEl);
			cellEl.appendChild(charEl);
		}
	}

	/**
	 * Add listener to mouse enter for cell
	 *
	 * @param callback
	 */
	addCellEnterListener(callback) {
		this.cellEnterListeners.push(callback);
	}

	/**
	 * Add listener to mouse leave for cell
	 *
	 * @param callback
	 */
	addCellLeaveListener(callback) {
		this.cellLeaveListeners.push(callback);
	}

	/**
	 * Add listener to mouse click for cell
	 *
	 * @param callback
	 */
	addCellClickListener(callback) {
		this.cellClickListeners.push(callback);
	}

	/**
	 * Add listener to "New Game" button click
	 *
	 * @param callback
	 */
	addNewGameListener(callback) {
		this.newGameListeners.push(callback);
	}

	/**
	 * Add listener to "Save Game" button click
	 *
	 * @param callback
	 */
	addSaveGameListener(callback) {
		this.saveGameListeners.push(callback);
	}

	/**
	 * Add listener to "Load Game" button click
	 *
	 * @param callback
	 */
	addLoadGameListener(callback) {
		this.loadGameListeners.push(callback);
	}

	onCellEnter(event) {
		event.preventDefault();
		const index = this.cells.indexOf(event.currentTarget);
		this.cellEnterListeners.forEach((o) => o.call(null, index));
	}

	onCellLeave(event) {
		event.preventDefault();
		const index = this.cells.indexOf(event.currentTarget);
		this.cellLeaveListeners.forEach((o) => o.call(null, index));
	}

	onCellClick(event) {
		const index = this.cells.indexOf(event.currentTarget);
		this.cellClickListeners.forEach((o) => o.call(null, index));
	}

	onNewGameClick(event) {
		event.preventDefault();
		this.newGameListeners.forEach((o) => o.call(null));
	}

	onSaveGameClick(event) {
		event.preventDefault();
		this.saveGameListeners.forEach((o) => o.call(null));
	}

	onLoadGameClick(event) {
		event.preventDefault();
		this.loadGameListeners.forEach((o) => o.call(null));
	}

	showError(message) {
		return new Promise((resolve) => {
			const messWrap = this.container.querySelector('[id-data=message]');
			messWrap.textContent = message;
			messWrap.classList.add('message-error');
			messWrap.classList.remove('hidden-item');

			setTimeout(() => {
				resolve(messWrap.classList.add('hidden-item'));
			}, 1000);
		});
	}

	showMessage(message) {
		return new Promise((resolve) => {
			const messWrap = this.container.querySelector('[id-data=message]');
			messWrap.textContent = message;
			messWrap.classList.remove('message-error');
			messWrap.classList.remove('hidden-item');

			setTimeout(() => {
				resolve(messWrap.classList.add('hidden-item'));
			}, 3000);
		});
	}

	selectCell(index, color = 'yellow') {
		this.deselectCell(index);
		this.cells[index].classList.add('selected', `selected-${color}`);
	}

	deselectCell(index) {
		const cell = this.cells[index];
		cell.classList.remove(...Array.from(cell.classList)
			.filter((o) => o.startsWith('selected')));
	}

	showCellTooltip(message, index) {
		this.cells[index].title = message;
	}

	hideCellTooltip(index) {
		this.cells[index].title = '';
	}

	showDamage(damage, attacker, target, recalcHealth) {
		return new Promise((resolve) => {
			const cell = this.cells[target.position];
			const damageEl = document.createElement('span');
			damageEl.textContent = damage;
			damageEl.classList.add('damage');
			cell.appendChild(damageEl);
			damageEl.addEventListener('animationend', () => {
				cell.removeChild(damageEl);
				resolve(recalcHealth(damage, attacker, target));
			});
		});
	}

	showCurrentPoints(points) {
		const pointsVal = points || 0;
		this.cellCurrentPoints.querySelector('[data-id=points-current-value]').textContent = pointsVal;
	}

	showMaxPoints(points) {
		const pointsVal = points?.points || 0;
		this.cellMaxPoints.querySelector('[data-id=points-max-value]').textContent = pointsVal;
	}

	showCellsForMove(cells) {
		this.clearCellsForMove();
		for (const indexCell of cells) {
			const cell = this.cells[indexCell];
			const isCharacter = cell.querySelector('.character');
			if (!isCharacter) {
				cell.classList.add('move');
			}
		}
	}

	clearCellsForMove() {
		const cells = this.container.querySelectorAll('.move');
		for (const cell of cells) {
			cell.classList.remove('move');
		}
	}

	showCellsForAttack(cells, teamPC) {
		this.clearCellsForAttack();
		for (const indexCell of cells) {
			const cell = this.cells[indexCell];
			const character = cell.querySelector('.character');
			if (character) {
				for (const item of teamPC) {
					if (character.classList.contains(item.character.type)) {
						character.classList.add('attack');
					}
				}
			}
		}
	}

	clearCellsForAttack() {
		const cells = this.container.querySelectorAll('.attack');
		for (const cell of cells) {
			cell.classList.remove('attack');
		}
	}

	setCursor(cursor) {
		this.boardEl.style.cursor = cursor;
	}

	checkBinding() {
		if (this.container === null) {
			throw new Error('GamePlay not bind to DOM');
		}
	}
}
