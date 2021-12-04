const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = mongoose.Schema({
	name: { type: String, required: true, unique: true },
	listedPrice: { type: Number, required: true },
	discountPrice: { type: Number },
	supplier: { type: String, required: true },
	slug: { type: String, slug: ["name"], unique: true },
	isHot: { type: Boolean, default: false },
	isInSlider: { type: Boolean, default: false },
	thumbnail: { type: String, required: true },
	photos: {
		type: [{
			type: String
		}],
		default: []
	},
	quantity: { type: Number, default: 0 },
	description: { type: String, default: "" },
	tags: {
		type: [{
			type: String
		}],
		default: []
	},
	createdDate: { type: Date, default: Date.now, immutable: true },
	modifiedDate: { type: Date, default: Date.now },
});

productSchema.pre(
	[
		'update',
		'updateOne',
		'updateMany',
		'findOneAndUpdate',
		'findByIdAndUpdate'
	],
	async function (next) {
		this.modifiedDate = Date.now();
		next();
	}
)

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
