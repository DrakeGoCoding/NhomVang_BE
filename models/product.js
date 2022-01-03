const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    listedPrice: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    supplier: { type: String, required: true },
    slug: { type: String, slug: ["name"], unique: true },
    isHot: { type: Boolean, default: false },
    isInSlider: { type: Boolean, default: false },
    thumbnail: { type: String, required: true },
    photos: {
        type: [
            {
                type: String
            }
        ],
        default: []
    },
    inStock: { type: Number, default: 0 },
    description: { type: String, default: "" },
    tags: {
        type: [
            {
                type: String
            }
        ],
        default: []
    },
    createdDate: { type: Date, default: Date.now, immutable: true },
    modifiedDate: { type: Date, default: Date.now, immutable: true },
    logs: {
        type: [
            {
                _id: false,
                user: {
                    type: String,
                    required: true
                },
                action: {
                    type: String,
                    enum: ["create", "update"]
                },
                details: [
                    {
						_id: false,
                        field: String,
						prevValue: mongoose.Schema.Types.Mixed,
                        nextValue: mongoose.Schema.Types.Mixed
                    }
                ],
                timestamp: { type: Date, default: Date.now, immutable: true }
            }
        ],
		default: []
    }
});

productSchema.pre(
    ["update", "updateOne", "updateMany", "findOneAndUpdate", "findByIdAndUpdate"],
    async function (next) {
        this.modifiedDate = Date.now();
        next();
    }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
