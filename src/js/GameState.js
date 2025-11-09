export default class GameState {
	constructor() {
		this.activeMove = 'player';
		this.playerLvl = 1;
		this.points = 0;
		this.historyPoints = [];

		this.activeCharacter = false;
		this.possibleAttackRange = [];
		this.possibleMoveRange = [];
	}

	changeMove() {
		const next = (this.activeMove === 'player') ? 'PC' : 'player';
		this.activeMove = next;
	}

	clearGameState() {
		this.activeCharacter = false;
		this.possibleAttackRange = [];
		this.possibleMoveRange = [];
	}

	static calcPossibleCellsAttack(index, boardSize, maxStep) {
		const shiftTop = GameState.shiftAttackTop(index, boardSize, maxStep);
		const shiftRight = GameState.shiftAttackRight(index, boardSize, maxStep);
		const shiftDown = GameState.shiftAttackDown(index, boardSize, maxStep);
		const shiftLeft = GameState.shiftAttackLeft(index, boardSize, maxStep);

		const start = shiftTop - (index - shiftLeft);
		const totalX = shiftRight - shiftLeft;
		const last = shiftDown + (shiftRight - index);

		const arrayCells = [];

		for (let i = start; i <= last; i += boardSize) {
			for (let k = 0; k <= totalX; k += 1) {
				const cell = (i + k);
				if (cell !== index) {
					arrayCells.push(cell);
				}
			}
		}
		return arrayCells;
	}

	static shiftAttackTop(index, boardSize, maxStep) {
		const maxShiftStep = index - (boardSize * maxStep);

		if (maxShiftStep > 0) {
			return maxShiftStep;
		}

		let maxPossibleShift = index;

		for (let i = index; i >= boardSize; i -= boardSize) {
			maxPossibleShift -= boardSize;
		}
		return maxPossibleShift;
	}

	static shiftAttackRight(index, boardSize, maxStep) {
		const maxShiftStep = index + maxStep;

		let maxPossibleShift = index;
		for (let i = 0; i < boardSize; i += 1) {
			const chek = (maxPossibleShift + i + 1) % boardSize;
			if (chek === 0) {
				maxPossibleShift += i;
				break;
			}
		}

		let shift;
		if (maxPossibleShift > maxShiftStep) {
			shift = maxShiftStep;
		} else {
			shift = maxPossibleShift;
		}

		return shift;
	}

	static shiftAttackDown(index, boardSize, maxStep) {
		const maxShiftStep = index + (boardSize * maxStep);

		if (maxShiftStep < (boardSize ** 2)) {
			return maxShiftStep;
		}

		let maxPossibleShift = index;

		for (let i = index; i < ((boardSize ** 2) - boardSize); i += boardSize) {
			maxPossibleShift += boardSize;
		}
		return maxPossibleShift;
	}

	static shiftAttackLeft(index, boardSize, maxStep) {
		const maxShiftStep = index - maxStep;

		let maxPossibleShift = index;
		for (let i = 1; i < boardSize; i += 1) {
			const chek = (maxPossibleShift - i) % boardSize;
			if (chek === 0) {
				maxPossibleShift -= i;
				break;
			}
		}

		let shift;
		if (maxPossibleShift < maxShiftStep) {
			shift = maxShiftStep;
		} else {
			shift = maxPossibleShift;
		}
		return shift;
	}

	static calcPossibleCellsMove(index, boardSize, maxStep, allowedDirection = {
		top: true, right: true, down: true, left: true,
	}) {
		const paramsForCalcRanges = [index, boardSize, maxStep, allowedDirection];
		const allPossibleRanges = GameState.calcPossibleSteps(...paramsForCalcRanges);
		const possibleRange = allPossibleRanges.filter((item) => item !== 0);
		const allPossibleCells = possibleRange.map((item) => item + index);
		allPossibleCells.sort((a, b) => a - b);
		return allPossibleCells;
	}

	static calcPossibleSteps(index, boardSize, maxStep, allowedDirection) {
		const allPossibleRanges = [];

		for (let i = 1; i <= maxStep; i += 1) {
			const steps = GameState.calcPossibleRangesForStep(index, boardSize, i, allowedDirection);
			allPossibleRanges.push(...steps);
		}

		return allPossibleRanges;
	}

	// добавить player = true и запускать проверку правой ячейки только если
	static calcPossibleRangesForStep(index, boardSize, step, allowedDirection) {
		const {
			top, right, down, left,
		} = allowedDirection;
		let chekTop = false;
		let chekDown = false;
		let chekLeft = false;
		let chekRight = false;

		const possibleRange = [];

		if (top && (index >= (boardSize * step))) {
			if (left && right) {
				possibleRange.push(-boardSize * step);
			}
			chekTop = true;
		}

		if (left && (index % boardSize >= step)) {
			if (top && down) {
				possibleRange.push(-1 * step);
			}
			chekLeft = true;
		}

		if (down && (index < ((boardSize ** 2) - (boardSize * step)))) {
			if (left && right) {
				possibleRange.push(boardSize * step);
			}
			chekDown = true;
		}

		if (right && ((index + step) % boardSize >= step)) {
			if (top && down) {
				possibleRange.push(1 * step);
			}
			chekRight = true;
		}

		if (chekTop && chekLeft) {
			possibleRange.push((-boardSize - 1) * step);
		}

		if (chekTop && chekRight) {
			possibleRange.push((-boardSize + 1) * step);
		}

		if (chekDown && chekRight) {
			possibleRange.push((boardSize + 1) * step);
		}

		if (chekDown && chekLeft) {
			possibleRange.push((boardSize - 1) * step);
		}

		return possibleRange;
	}
}
