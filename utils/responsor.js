const responseUser = user => {
	const { _id, __v, hash, salt, ...rest } = user;
	return rest;
}

const responseNews = news => {
	const { _id, __v, author, ...rest } = news;
	return { ...rest, author: author.displayname };
}

const responseProduct = product => {
	const { _id, __v, ...rest } = product;
	return rest;
}

module.exports = {
	responseUser,
	responseNews,
	responseProduct
}
