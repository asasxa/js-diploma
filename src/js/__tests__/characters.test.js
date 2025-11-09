import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';

import Vampire from '../characters/Vampire';
import Undead from '../characters/Undead';
import Daemon from '../characters/Daemon';

import Character from '../Character';

test('create bowman', () => {
	const received = new Bowman(3);
	const expected = {
		level: 3,
		attack: 25,
		defence: 25,
		health: 50,
		moveRange: 2,
		attackRange: 2,
		type: 'bowman',
	};

	expect(received).toEqual(expected);
});

test('create swordsman', () => {
	const received = new Swordsman(2);
	const expected = {
		level: 2,
		attack: 40,
		defence: 10,
		health: 50,
		moveRange: 4,
		attackRange: 1,
		type: 'swordsman',
	};

	expect(received).toEqual(expected);
});

test('create magician', () => {
	const received = new Magician(1);
	const expected = {
		level: 1,
		attack: 10,
		defence: 40,
		health: 50,
		moveRange: 1,
		attackRange: 4,
		type: 'magician',
	};

	expect(received).toEqual(expected);
});

test('create vampire', () => {
	const received = new Vampire(2);
	const expected = {
		level: 2,
		attack: 25,
		defence: 25,
		health: 50,
		moveRange: 2,
		attackRange: 2,
		type: 'vampire',
	};

	expect(received).toEqual(expected);
});

test('create undead', () => {
	const received = new Undead(3);
	const expected = {
		level: 3,
		attack: 40,
		defence: 10,
		health: 50,
		moveRange: 4,
		attackRange: 1,
		type: 'undead',
	};

	expect(received).toEqual(expected);
});

test('create daemon', () => {
	const received = new Daemon(4);
	const expected = {
		level: 4,
		attack: 10,
		defence: 40,
		health: 50,
		moveRange: 1,
		attackRange: 4,
		type: 'daemon',
	};

	expect(received).toEqual(expected);
});

test('create character', () => {
	const expected = 'Неверно вызван конструктор';

	expect(() => new Character(3)).toThrow(expected);
});
