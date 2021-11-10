const responseUser = user => {
	const { hash, salt, ...rest } = user;
	return rest;
}

module.exports = {
	responseUser
}
