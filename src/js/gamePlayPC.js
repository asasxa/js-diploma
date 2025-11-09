import GameState from './GameState';

const allowedDirection = {
	top: true,
	right: false,
	down: true,
	left: true,
};

const shuffleTeam = (TeamPC) => {
	const team = TeamPC;
	const startLength = team.length;
	const mixedTeam = [];

	for (let i = startLength; i > 0; i -= 1) {
		const index = Math.floor(Math.random() * i);
		mixedTeam.push(...team.splice(index, 1));
	}
	team.push(...mixedTeam);
	return team;
};

const chekPossibleAttack = (TeamPC, TeamPlayer, boardSize) => {
	let attackObj = {
		attacker: null,
		target: null,
		valueAttack: null,
		diffAttackDef: null,
	};

	for (const character of TeamPC) {
		const paramsForAttacks = [character.position, boardSize, character.character.attackRange];
		const possibleAttackCells = GameState.calcPossibleCellsAttack(...paramsForAttacks);

		for (const player of TeamPlayer) {
			if (possibleAttackCells.includes(player.position)) {
				const diffAttackDef = character.character.attack - player.character.defence;
				const valueAttack = character.character.attack;

				if ((diffAttackDef > attackObj.diffAttackDef) || (valueAttack > attackObj.valueAttack)) {
					attackObj = {
						attacker: character,
						target: player,
						valueAttack,
						diffAttackDef,
					};
				}
			}
		}
	}
	if (attackObj.attacker) {
		return {
			type: 'attack',
			attacker: attackObj.attacker,
			target: attackObj.target,
		};
	}
	return false;
};

const randomCellForMove = (cells) => {
	const count = cells.length;
	const index = Math.floor(Math.random() * count);
	const cell = cells[index];
	return cell;
};

const chekBlankCells = (cells, positionsCharacters) => {
	const filledCells = [];
	for (const character of positionsCharacters) {
		filledCells.push(character.position);
	}

	const blankCellls = [];
	for (const cell of cells) {
		if (!filledCells.includes(cell)) {
			blankCellls.push(cell);
		}
	}
	return blankCellls;
};

const chekPossibleForward = (TeamPC, positionsCharacters, boardSize) => {
	for (const character of TeamPC) {
		const char = character;
		const paramsForMove = [char.position, boardSize, char.character.moveRange, allowedDirection];
		const possibleForwardCells = GameState.calcPossibleCellsMove(...paramsForMove);
		const blankCellls = chekBlankCells(possibleForwardCells, positionsCharacters);
		if (blankCellls.length > 0) {
			const cell = randomCellForMove(blankCellls);
			return	{
				type: 'move',
				mover: char,
				target: cell,
			};
		}
	}
	return false;
};

const chekPossibleAnyMove = (TeamPC, positionsCharacters, boardSize) => {
	for (const character of TeamPC) {
		const paramsForMove = [character.position, boardSize, character.character.moveRange];
		const possibleMoveCells = GameState.calcPossibleCellsMove(...paramsForMove);
		const blankForMoveCells = chekBlankCells(possibleMoveCells, positionsCharacters);
		if (blankForMoveCells.length > 0) {
			const cell = randomCellForMove(blankForMoveCells);
			return {
				type: 'move',
				mover: character,
				target: cell,
			};
		}
	}
	return false;
};

const startActionPC = (teams, boardSize) => {
	const positionsTeamPlayer = teams.teamPlayer;
	const positionsCharacters = [...teams.teamPlayer, ...teams.teamPC];

	const positionsTeamPC = shuffleTeam(teams.teamPC);

	const attack = chekPossibleAttack(positionsTeamPC, positionsTeamPlayer, boardSize);
	if (attack) {
		return attack;
	}

	const forward = chekPossibleForward(positionsTeamPC, positionsCharacters, boardSize);
	if (forward) {
		return forward;
	}

	const move = chekPossibleAnyMove(positionsTeamPC, positionsCharacters, boardSize);
	if (move) {
		return move;
	}

	return false;
};

export default startActionPC;
