const { decode } = require("html-entities");
const Newsletter = require("@models/newsletter");
const User = require("@models/user");
const sendEmail = require("@utils/nodemailer");
const { responseNewsletter } = require("@utils/responsor");
const AppError = require("@utils/appError");
const { NOT_FOUND_NEWSLETTER } = require("@constants/error");

/**
 * Get all newsletters
 * @param {Number} limit
 * @param {Number} offset
 * @DrakeGoCoding 12/28/2021
 */
const getAllNewsletters = async (limit = 10, offset = 0) => {
    const query = {};
    const result = await Newsletter.collection.find(query).sort({ createdDate: -1 });
    const total = await result.count();
    const newsletterList = await result.skip(offset).limit(limit).toArray();

    if (!total || !newsletterList || newsletterList.length === 0) {
        return {
            statusCode: 200,
            data: {
                newsletterList: [],
                total: 0
            }
        };
    }

    return {
        statusCode: 200,
        data: {
            newsletterList: newsletterList.map(newsletter => responseNewsletter(newsletter)),
            total
        }
    };
};

/**
 * Get newsletter by id
 * @param {String} id
 * @DrakeGoCoding 12/28/2021
 */
const getNewsletter = async id => {
    const newsletter = await Newsletter.findById(id);
    if (!newsletter) {
        throw new AppError(404, "fail", NOT_FOUND_NEWSLETTER);
    }
    return {
        statusCode: 200,
        data: { newsletter: responseNewsletter(newsletter.toJSON()) }
    };
};

/**
 * Send newsletter to subscribers' email
 * @param {String} subject
 * @param {String} content
 * @DrakeGoCoding 12/28/2021
 */
const sendNewsletter = async (subject = "", content) => {
    const query = {
        role: "user",
        isSubscribing: true
    };
    let subscribers = await User.find(query).select("username email").lean();
    subscribers = subscribers.filter(subscriber => subscriber.email);

    content = decode(content);

    subscribers.forEach(subscriber => {
        sendEmail(subscriber.email, subject, "newsletter.handlebars", { content });
    });

    const newsletter = await Newsletter.create({
        subject,
        content,
        users: subscribers
    });

    return {
        statusCode: 200,
        data: {
            newsletter: responseNewsletter(newsletter.toJSON())
        }
    };
};

module.exports = {
    getAllNewsletters,
    getNewsletter,
    sendNewsletter
};
