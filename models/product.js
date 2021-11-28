const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	name: { type: String, required: true },
	listedPrice: { type: Number, required: true },
	discountPrice: { type: Number },
	isHot: { type: Boolean, default: false },
	isInSlider: { type: Boolean, default: false },
	thumbnail: { type: String },
	photos: {
		type: [{
			type: String
		}],
	},
	quantity: { type: Number, default: 0 },
	description: { type: String },
	tags: {
		type: [{
			type: String
		}]
	},
	supplier: { type: String, required: true },
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
