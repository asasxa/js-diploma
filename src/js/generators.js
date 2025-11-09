import Team from './Team';

const upCharacteristic = (character, level) => {
	const updCharacter = character;
	for (let i = 0; i < level; i += 1) {
		updCharacter.attack = Math.round(character.attack * 1.3);
		updCharacter.defence = Math.round(character.defence * 1.3);
	}
	return updCharacter;
};

export function* characterGenerator(allowedTypes, maxLevel) {
	const countTypes = allowedTypes.length;

	while (true) {
		const indexNewCharacterCharacter = Math.floor(Math.random() * countTypes);
		const level = Math.floor(1 + (Math.random() * maxLevel));
		const ClassNewCharacter = allowedTypes[indexNewCharacterCharacter];
		let newCharacter = new ClassNewCharacter(level);
		if (level > 1) {
			const newCharacterUpd = upCharacteristic(newCharacter, level);
			newCharacter = newCharacterUpd;
		}
		yield newCharacter;
	}
}

export function upTeamLvl(team) {
	const newListCharacters = [];
	for (const positionCharacter of team) {
		const { char } = positionCharacter;
		const { health } = char;
		const newHealth = health + 80;

		const attack = Math.round(Math.max(char.attack, char.attack * ((80 + health) / 100)));
		const defence = Math.round(Math.max(char.defence, char.defence * ((80 + health) / 100)));

		char.attack = attack;
		char.defence = defence;
		char.health = (newHealth > 100) ? 100 : newHealth;
		char.level += 1;
		newListCharacters.push(char);
	}
	const newTeam = new Team(newListCharacters);
	return newTeam;
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
	const listCharacters = [];
	const generatorCharacters = characterGenerator(allowedTypes, maxLevel);

	for (let i = 0; i < characterCount; i += 1) {
		const newCharacter = generatorCharacters.next().value;
		listCharacters.push(newCharacter);
	}

	const newTeam = new Team(listCharacters);
	return newTeam;
}
