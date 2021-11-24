const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const newsSchema = mongoose.Schema({
	title: { type: String, required: true },
	author: { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: "User", 
		required: true
	},
	body: { type: String, required: true },
	thumbnail: { type: String },
	description: { type: String },
	slug: { type: String, slug: ["title"], unique: true },
	createdDate: { type: Date, default: Date.now, immutable: true },
	modifiedDate: { type: Date, default: Date.now },
});

const News = mongoose.model('News', newsSchema);
module.exports = News;
