const responseUser = user => {
	const { _id, __v, hash, salt, ...rest } = user;
	return rest;
}

module.exports = {
	responseUser
}
