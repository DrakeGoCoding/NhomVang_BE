const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const newsSchema = mongoose.Schema({
	title: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	body: { type: String, required: true },
	image: { type: String },
	description: { type: String },
	slug: { type: String, slug: ["title"], unique: true },
	createdDate: { type: Date, default: Date.now },
	modifiedDate: { type: Date, default: Date.now },
});

const News = mongoose.model('News', newsSchema);
module.exports = News;