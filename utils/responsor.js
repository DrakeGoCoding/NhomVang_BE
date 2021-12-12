const responseUser = user => {
    const { __v, hash, salt, ...rest } = user;
    return rest;
};

const responseNews = news => {
    const { __v, author, ...rest } = news;
    return { author: author.displayname, ...rest };
};

const responseProduct = product => {
    const { __v, ...rest } = product;
    return rest;
};

const responseCart = cart => {
    const { id, __v, user, items, ...rest } = cart;
    let total = 0;
    let discountTotal = 0;
    const responseItem = items.map(item => {
        const { id, quantity } = item;
        total += id.listedPrice * quantity;
        discountTotal += (id.discountPrice || id.listedPrice) * quantity;
        return { quantity, ...responseProduct(id) };
    });
    return { items: responseItem, total, discountTotal, ...rest };
};

module.exports = {
    responseUser,
    responseNews,
    responseProduct,
    responseCart
};
