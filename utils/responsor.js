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
    const { __v, user, items, ...rest } = cart;
    const responseItem = items.map(item => {
        const { _id, quantity } = item;
        return { quantity, ...responseProduct(_id) };
    });
    return { items: responseItem, ...rest };
};

const responseInvoice = invoice => {
    const { __v, ...rest } = invoice;
    return rest;
};

const responseNewsletter = newsletter => {
    const { __v, ...rest } = newsletter;
    return rest;
};

module.exports = {
    responseUser,
    responseNews,
    responseProduct,
    responseCart,
    responseInvoice,
    responseNewsletter
};
