let categories = [
	{id: 'animals', parent: null},
	{id: 'mammals', parent: 'animals'},
	{id: 'cats', parent: 'mammals'},
	{id: 'dogs', parent: 'mammals'},
	{id: 'chihuahua', parent: 'dogs'},
	{id: 'labrador', parent: 'dogs'},
	{id: 'tuxedo', parent: 'cats'},
	{id: 'tabby', parent: 'cats'},
	{id: 'sinatra', parent: 'tuxedo'},
	{id: 'gustav', parent: 'tabby'},
	{id: 'amira', parent: 'labrador'},
	{id: 'rocky', parent: 'chihuahua'},
];

let makeTree = (categories, parent) => {
	let node = {};
	categories
		.filter(c => c.parent === parent)
		.forEach(c => node[c.id] = makeTree(categories, c.id));
	return node;
};

console.log(JSON.stringify(makeTree(categories, null), null, 2));