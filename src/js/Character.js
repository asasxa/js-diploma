export default class Character {
	constructor(level, type = 'generic') {
		this.level = level;
		this.attack = 0;
		this.defence = 0;
		this.health = 50;
		this.type = type;
		this.moveRange = 0;
		this.attackRange = 0;
		if (new.target.name === 'Character') {
			throw new Error('Неверно вызван конструктор!');
		}
	}
}
