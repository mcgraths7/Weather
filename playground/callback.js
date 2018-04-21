let getUser = (id, callback) => {
	let user = {
		id: id,
		name: "Steven"
	};
	setTimeout(() =>{
		callback(user);
	}, 3000);
};

getUser(12, (user) => {
	console.log(user);
});