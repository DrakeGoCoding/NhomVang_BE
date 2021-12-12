const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    description: { type: String, default: "" },
    slug: { type: String, slug: ["title"], unique: true },
    createdDate: { type: Date, default: Date.now, immutable: true },
    modifiedDate: { type: Date, default: Date.now }
});

newsSchema.pre(["update", "updateOne", "updateMany", "findOneAndUpdate", "findByIdAndUpdate"], async function (next) {
    this.modifiedDate = Date.now();
    next();
});

const News = mongoose.model("News", newsSchema);
module.exports = News;
