const themes = {
	prairie: 'prairie',
	desert: 'desert',
	arctic: 'arctic',
	mountain: 'mountain',
};

const arrayThemes = {};
let i = 1;

for (const value of Object.values(themes)) {
	arrayThemes[`Level ${i}`] = value;
	i += 1;
}

export default themes;
