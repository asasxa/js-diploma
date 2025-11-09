export function calcTileType(index, boardSize) {
	if (typeof index !== 'number' || typeof boardSize !== 'number') {
		throw new Error('Указано не число!');
	}

	if (index >= (boardSize ** 2)) {
		throw new Error('Неверный индекс');
	}

	let position = 'center';

	const topLeft = 0;
	const topRight = boardSize - 1;
	const bottomRight = (boardSize ** 2) - 1;
	const bottomLeft = (boardSize ** 2) - boardSize;

	if (index < topRight) {
		position = 'top';
	}

	if ((index + 1) % boardSize === 0) {
		position = 'right';
	}

	if ((index > bottomLeft) && (index < bottomRight)) {
		position = 'bottom';
	}

	if (index % boardSize === 0) {
		position = 'left';
	}

	switch (index) {
	case topLeft:
		position = 'top-left';
		break;

	case topRight:
		position = 'top-right';
		break;

	case bottomRight:
		position = 'bottom-right';
		break;

	case bottomLeft:
		position = 'bottom-left';
		break;

	default:
		break;
	}

	return position;
}

export function calcHealthLevel(health) {
	if (health < 15) {
		return 'critical';
	}

	if (health < 50) {
		return 'normal';
	}

	return 'high';
}
