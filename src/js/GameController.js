import themes from './themes';
import cursors from './cursors';

import { generateTeam, upTeamLvl } from './generators';

import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import startActionPC from './gamePlayPC';

import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';

import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';

// const playersCharacter = [Bowman, Swordsman, Magician];
// const PCsCharacter = [Vampire, Undead, Daemon];

export default class GameController {
	constructor(gamePlay, stateService) {
		this.gamePlay = gamePlay;
		this.stateService = stateService;
		this.gameState = new GameState();
		this.gamePlay.cursors = cursors;
		this.gamePlay.themes = Object.values(themes);
	}

	init() {
		this.gamePlay.drawUi(this.gamePlay.themes[0]);
		this.createPossibleCharacters();
		this.registerEvent();
		this.loadHistoryPoints();
		this.gamePlay.showMaxPoints(this.gameState.historyPoints[0]);
		this.gamePlay.showCurrentPoints(0);

		this.calcField();
		this.createStartingPosition();
	}

	calcField() {
		const { boardSize } = this.gamePlay;
		const fieldSize = boardSize ** 2;
		this.gamePlay.fieldSize = fieldSize;
		this.gamePlay.firstCellForPC = boardSize - 2;
	}

	createPossibleCharacters() {
		this.gamePlay.charactersForPlayer = [Bowman, Swordsman, Magician];
		this.gamePlay.charactersForPC = [Vampire, Undead, Daemon];
	}

	createStartingPosition() {
		const teamPlayer = GameController.createTeam(this.gamePlay.charactersForPlayer, this.gamePlay.maxStartLvl, this.gamePlay.countCharacterTeam);
		const teamPC = GameController.createTeam(this.gamePlay.charactersForPC, this.gamePlay.maxStartLvl, this.gamePlay.countCharacterTeam);
		const positiongTeamPlayer = GameController.calcPositioningTeam(0, this.gamePlay.fieldSize, this.gamePlay.boardSize, teamPlayer);
		const positiongTeamPC = GameController.calcPositioningTeam(this.gamePlay.firstCellForPC, this.gamePlay.fieldSize, this.gamePlay.boardSize, teamPC);
		const teams = GameController.mergeTeams(positiongTeamPlayer, positiongTeamPC);

		this.savePositionTeam(teams);
		this.positioning(teams);
	}

	static mergeTeams(teamPlayer, teamPC) {
		const teams = {
			teamPlayer,
			teamPC,
		};
		return teams;
	}

	static createTeam(characters, maxLvl, countCharacters) {
		const team = generateTeam(characters, maxLvl, countCharacters);
		return team;
	}

	static calcPositioningTeam(startPosition, fieldSize, boardSize, team) {
		const possibleCells = GameController.creatingArrayFromCharacter(startPosition, fieldSize, boardSize);
		const positionsTeam = GameController.creatinfArrayPositions(possibleCells, team.team);
		return positionsTeam;
	}

	savePositionTeam(teams) {
		this.gameState.teams = teams;
	}

	registerEvent() {
		this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
		this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
		this.gamePlay.addCellClickListener(this.onCellClick.bind(this));

		this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
		this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
		this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
	}

	clearEvent() {
		this.gamePlay.cellEnterListeners = [];
		this.gamePlay.cellLeaveListener = [];
		this.gamePlay.cellClickListeners = [];
	}

	static creatingArrayFromCharacter(start, end, step) {
		const arrayPosition = [];

		for (let i = start; i < end; i += step) {
			arrayPosition.push(i);
			arrayPosition.push(i + 1);
		}
		return arrayPosition;
	}

	static creatinfArrayPositions(freeCell, team) {
		const positions = [];

		for (let i = 0; i < team.length; i += 1) {
			const countFreeCell = freeCell.length;
			const indexNewPosition = Math.floor(Math.random() * countFreeCell);

			const arrayNewPosition = freeCell.splice(indexNewPosition, 1);

			const newPosition = Number(arrayNewPosition[0]);
			const position = new PositionedCharacter(team[i], newPosition);

			positions.push(position);
		}
		return positions;
	}

	positioning(teams) {
		const positions = [...teams.teamPlayer, ...teams.teamPC];
		this.gamePlay.redrawPositions(positions);
	}

	onCellClick(index) {
		if (this.gameState.activeMove === 'PC') {
			this.gamePlay.showError('Сейчас не ваш ход!');
			return;
		}

		const isPC = this.gameState.teams.teamPC.find((item) => item.position === index) || false;
		const isPlayer = this.gameState.teams.teamPlayer.find((item) => item.position === index) || false;
		const { activeCharacter } = this.gameState;

		if (isPlayer) {
			this.changeCharacter(index, isPlayer);
			return;
		}

		if (activeCharacter && isPC) {
			const possibleAttack = this.gameState.possibleAttackRange.indexOf(index);
			if (possibleAttack > -1) {
				this.attackCharacter(activeCharacter, isPC);
			} else {
				this.gamePlay.showError('Враг слишком далеко!');
			}
			return;
		}

		if (activeCharacter && !isPC && !isPlayer) {
			const possibleMove = this.gameState.possibleMoveRange.indexOf(index);
			if (possibleMove > -1) {
				this.moveCharacter(activeCharacter, index);
			} else {
				this.gamePlay.showError('Слишком далеко, я сюда не дойду!');
			}
			return;
		}
		if (!activeCharacter && isPC) {
			this.gamePlay.showError('Нужно выбрать своего персонажа!');
		}
	}

	onCellEnter(index) {
		const character = this.gameState.teams.teamPlayer.find((item) => item.position === index)
		|| this.gameState.teams.teamPC.find((item) => item.position === index);

		if (this.gameState.activeCharacter) {
			this.initActiveCell(index);
		}
		if (character) {
			this.createMessage(character.character, index);
		}
	}

	createMessage(character, index) {
		const message = `\u{1F396} ${character.level} \u{2764} ${character.health} \u{2694} ${character.attack} \u{1F6E1} ${character.defence}`;

		this.gamePlay.showCellTooltip(message, index);
	}

	onCellLeave(index) {
		this.gamePlay.hideCellTooltip(index);
		this.clearCellFromDecoration(index);
	}

	initActiveCell(index) {
		if (index === this.gameState.activeCharacter.position) {
			return;
		}

		const isPlayer = this.gameState.teams.teamPlayer.find((item) => index === item.position) || false;
		const isPC = this.gameState.teams.teamPC.find((item) => index === item.position) || false;

		if (isPlayer) {
			this.activeCellForChangeCharacter();
			return;
		}

		if (isPC) {
			const isAvailablePC = this.gameState.possibleAttackRange.indexOf(index);

			if (isAvailablePC >= 0) {
				this.activeCellForAttack(index);
			} else {
				this.activeInacessibleCell();
			}
			return;
		}

		const isAvailableCellForMove = this.gameState.possibleMoveRange.indexOf(index);
		if (isAvailableCellForMove >= 0) {
			this.activeCellForMove(index);
			return;
		}
		this.activeInacessibleCell(index);
	}

	activeCellForChangeCharacter() {
		this.gamePlay.setCursor(this.gamePlay.cursors.pointer);
	}

	activeCellForAttack(index) {
		this.gamePlay.setCursor(this.gamePlay.cursors.crosshair);
		this.gamePlay.selectCell(index, 'red');
	}

	activeCellForMove(index) {
		this.gamePlay.setCursor(this.gamePlay.cursors.pointer);
		this.gamePlay.selectCell(index, 'green');
	}

	activeInacessibleCell() {
		this.gamePlay.setCursor(this.gamePlay.cursors.notallowed);
	}

	calcCellsForMove() {
		if (!this.gameState.activeCharacter) return;

		const { character, position } = this.gameState.activeCharacter;
		const maxStep = character.moveRange;
		const possibleMoveRange = GameState.calcPossibleCellsMove(position, this.gamePlay.boardSize, maxStep);

		this.gameState.possibleMoveRange = possibleMoveRange;
	}

	calcCellsForAttack() {
		if (!this.gameState.activeCharacter) return;

		const { character, position } = this.gameState.activeCharacter;
		const maxStep = character.attackRange;
		const possibleAttackRange = GameState.calcPossibleCellsAttack(position, this.gamePlay.boardSize, maxStep);
		this.gameState.possibleAttackRange = possibleAttackRange;
	}

	moveCharacter(mover, newCell) {
		const updMover = mover;
		const oldPosition = mover.position;
		const newPosition = newCell;

		const team = this.returnTeam(mover);

		const indexCharacter = team.indexOf(mover);
		updMover.position = newPosition;

		team.splice(indexCharacter, 1, updMover);
		this.gameState.clearGameState();
		this.clearCellFromDecoration(oldPosition);
		this.clearCellFromDecoration(newPosition);
		this.positioning(this.gameState.teams);

		if (this.gameState.activeMove === 'newLvl') {
			this.gameState.activeMove = 'player';
		} else {
			this.gameState.changeMove();
		}

		if (this.gameState.activeMove === 'PC') {
			this.actionPC();
		}
	}

	attackCharacter(attacker, target) {
		const damage = this.calcDamage(attacker, target);

		this.gamePlay.showDamage(damage, attacker, target, this.updateCharacters.bind(this));
	}

	calcDamage(attacker, target) {
		const damage = Math.round(Math.max((attacker.character.attack - target.character.defence) / 2, attacker.character.attack * 0.2));

		if (this.gameState.activeMove === 'player') {
			this.gameState.points += damage;
		} else {
			this.gameState.points -= damage;
			if (this.gameState.points < 0) {
				this.gameState.points = 0;
			}
		}
		this.gamePlay.showCurrentPoints(this.gameState.points);
		return damage;
	}

	changeCharacter(index, character) {
		if (this.gameState.activeCharacter) {
			this.gamePlay.deselectCell(this.gameState.activeCharacter.position);
		}

		this.gamePlay.selectCell(index);
		this.gameState.activeCharacter = character;
		this.calcCellsForMove();
		this.calcCellsForAttack();
		this.gamePlay.showCellsForMove(this.gameState.possibleMoveRange);
		this.gamePlay.showCellsForAttack(this.gameState.possibleAttackRange, this.gameState.teams.teamPC);
	}

	clearCellFromDecoration(index) {
		this.gamePlay.setCursor(this.gamePlay.cursors.auto);
		if (index !== this.gameState.activeCharacter.position) {
			this.gamePlay.deselectCell(index);
		}
	}

	updateCharacters(damage, attacker, target) {
		const newHealthTarget = target.character.health - damage;
		if (newHealthTarget <= 0) {
			this.deathCharacter(target);
		} else {
			const targChar = target.character;
			targChar.health = newHealthTarget;
		}

		this.gameState.clearGameState();
		this.clearCellFromDecoration(attacker.position);
		this.clearCellFromDecoration(target.position);

		if (this.gameState.activeMove === 'newLvl') {
			this.gameState.activeMove = 'player';
		} else {
			this.gameState.changeMove();
		}

		this.positioning(this.gameState.teams);

		if (this.gameState.activeMove === 'PC') {
			this.actionPC();
		}
	}

	returnTeam(character) {
		const isPlayer = this.gameState.teams.teamPlayer.includes(character);

		const team = (isPlayer) ? this.gameState.teams.teamPlayer : this.gameState.teams.teamPC;
		return team;
	}

	deathCharacter(target) {
		const team = this.returnTeam(target);

		const index = team.indexOf(target);
		team.splice(index, 1);

		if (this.gameState.teams.teamPlayer.length === 0) {
			this.gameOver();
		}

		if (this.gameState.teams.teamPC.length === 0) {
			this.levelUp();
		}
	}

	actionPC() {
		this.gamePlay.clearCellsForMove();
		this.gamePlay.clearCellsForAttack();

		const action = startActionPC(this.gameState.teams, this.gamePlay.boardSize);
		if (!action) {
			this.gameState.activeMove = 'player';
		}

		if (action.type === 'attack') {
			const { attacker, target } = action;
			this.attackCharacter(attacker, target);
		}

		if (action.type === 'move') {
			const { mover, target } = action;
			this.moveCharacter(mover, target);
		}
	}

	levelUp() {
		if (this.gameState.playerLvl <= 999) {
			this.gameState.playerLvl += 1;
			this.startNewLvl();
		} else {
			this.gamePlay.showMessage(`Ура! Победа! Ты набрал ${this.gameState.points} очков!`);
			this.addItemForHistoryPoints();
			this.clearEvent();
		}
	}

	startNewLvl() {
		this.addItemForHistoryPoints();

		const maxLvl = this.gamePlay.maxStartLvl + (this.gameState.playerLvl - 1);

		const charactersTeamPC = generateTeam(this.gamePlay.charactersForPC, maxLvl, this.gamePlay.countCharacterTeam);

		const charactersTeamPlayer = upTeamLvl(this.gameState.teams.teamPlayer);
		const teamPC = GameController.calcPositioningTeam(this.gamePlay.firstCellForPC, this.gamePlay.fieldSize, this.gamePlay.boardSize, charactersTeamPC);
		const teamPlayer = GameController.calcPositioningTeam(0, this.gamePlay.fieldSize, this.gamePlay.boardSize, charactersTeamPlayer);
		this.gameState.teams = {
			teamPC,
			teamPlayer,
		};

		this.gameState.activeMove = 'newLvl';
		this.gamePlay.drawUi(this.selectTheme());
		this.positioning(this.gameState.teams);
		this.gamePlay.showMaxPoints(this.gameState.historyPoints[0]);
		this.gamePlay.showCurrentPoints(this.gameState.points);
	}

	gameOver() {
		this.gamePlay.showMessage(`Ты проиграл... Но успел набрать ${this.gameState.points} очков!`);
		this.addItemForHistoryPoints();
		this.clearEvent();
	}

	addItemForHistoryPoints() {
		const date = Date.now();
		const newItem = {
			points: this.gameState.points,
			date,
		};

		const { historyPoints } = this.gameState;
		historyPoints.push(newItem);
		historyPoints.sort((a, b) => b.points - a.points);

		if (historyPoints.length > 5) {
			historyPoints.pop();
		}

		this.saveHistoryPoints();
	}

	saveHistoryPoints() {
		const historyPoints = JSON.stringify(this.gameState.historyPoints);

		if (historyPoints) {
			localStorage.setItem('historyPoints', historyPoints);
		}
	}

	loadHistoryPoints() {
		const historyPoints = JSON.parse(localStorage.getItem('historyPoints'));
		if (historyPoints) {
			this.gameState.historyPoints = historyPoints;
		}
	}

	onNewGame()	{
		if (this.gameState.activeCharacter) {
			this.gamePlay.deselectCell(this.gameState.activeCharacter.position);
			this.gameState.clearGameState();
			this.gamePlay.clearCellsForMove();
			this.gamePlay.clearCellsForAttack();
		}
		this.gameState.points = 0;
		this.gameState.activeMove = 'player';
		this.gameState.playerLvl = 1;
		this.addItemForHistoryPoints();
		if (this.gameState.activeCharacter) {
			this.gamePlay.deselectCell(this.gameState.activeCharacter.position);
		}

		if (this.gamePlay.cellEnterListeners.length === 0) {
			this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
		}

		if (this.gamePlay.cellLeaveListeners.length === 0) {
			this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
		}

		if (this.gamePlay.cellClickListeners.length === 0) {
			this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
		}

		this.gamePlay.drawUi(this.selectTheme());
		this.gamePlay.showCurrentPoints(0);
		this.gamePlay.showMaxPoints(this.gameState.historyPoints[0]);

		this.createStartingPosition();
	}

	onSaveGame() {
		this.addItemForHistoryPoints();
		this.gamePlay.showMaxPoints(this.gameState.historyPoints[0]);
		this.stateService.save(this.gameState);
	}

	onLoadGame() {
		this.gamePlay.clearCellsForMove();
		this.gamePlay.clearCellsForAttack();

		const state = this.stateService.load();

		if (state instanceof Error) {
			this.gamePlay.showError(state.message);
			return;
		}

		this.saveHistoryPoints();

		if (this.gameState.activeCharacter) {
			this.gamePlay.deselectCell(this.gameState.activeCharacter.position);
		}

		for (const key in state) {
			if (state[key] !== undefined)	{
				this.gameState[key] = null;
				this.gameState[key] = state[key];
			}
		}

		this.gamePlay.showCurrentPoints(this.gameState.points);

		if (this.gamePlay.cellEnterListeners.length === 0) {
			this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
		}

		if (this.gamePlay.cellLeaveListeners.length === 0) {
			this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
		}

		if (this.gamePlay.cellClickListeners.length === 0) {
			this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
		}

		this.gamePlay.drawUi(this.selectTheme());

		this.positioning(this.gameState.teams);
		this.gamePlay.showMaxPoints(this.gameState.historyPoints[0]);
		this.gamePlay.showCurrentPoints(this.gameState.points);

		if (this.gameState.activeCharacter) {
			this.onCellClick(this.gameState.activeCharacter.position);
		}

		if (this.gameState.activeMove === 'PC') {
			this.actionPC();
		}
	}

	selectTheme() {
		const countThemes = this.gamePlay.themes.length;
		const indexThemes = (this.gameState.playerLvl - 1) % countThemes;
		const activeTheme = this.gamePlay.themes[indexThemes];
		return activeTheme;
	}

	resetGameState() {
		this.gameState.clearGameState();
		this.gameState.activeMove = 'player';
		this.gameState.playerLvl = 1;
		this.gameState.points = 0;
		this.gamePlay.showMaxPoints(this.gameState.historyPoints[0]);
		this.gamePlay.showCurrentPoints(0);
		this.gameState.teams = null;
	}
}
