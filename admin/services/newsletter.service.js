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
    const aggregation = [
        { $sort: { createdDate: -1 } },
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender"
            }
        },
        {
            $facet: {
                stage1: [{ $group: { _id: null, count: { $sum: 1 } } }],
                stage2: [
                    { $skip: offset },
                    { $limit: limit },
                    {
                        $project: {
                            sender: { $arrayElemAt: ["$sender", 0] },
                            subject: 1,
                            content: 1,
                            createdDate: 1
                        }
                    }
                ]
            }
        },
        { $unwind: "$stage1" },
        { $project: { total: "$stage1.count", newsletterList: "$stage2" } }
    ];

    const query = await Newsletter.collection.aggregate(aggregation);
    const data = (await query.toArray())[0];

    return {
        statusCode: 200,
        data: {
            ...data,
            newsletterList: data ? data.newsletterList.map(newsletter => responseNewsletter(newsletter)) : []
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
 * @param {String} senderId
 * @param {String} subject
 * @param {String} content
 * @DrakeGoCoding 12/28/2021
 */
const sendNewsletter = async (senderId, subject = "", content) => {
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
        sender: senderId,
        subject,
        content,
        users: subscribers
    });

    return {
        statusCode: 200,
        data: {
            status: "success",
            newsletter: responseNewsletter(newsletter.toJSON())
        }
    };
};

module.exports = {
    getAllNewsletters,
    getNewsletter,
    sendNewsletter
};
