const responseUser = user => {
	const { _id, __v, hash, salt, ...rest } = user;
	return rest;
}

const responseNews = news => {
	const { _id, __v, ...rest } = news;
	return { ...rest, author: author.displayname };
}

module.exports = {
	responseUser,
	responseNews
}
