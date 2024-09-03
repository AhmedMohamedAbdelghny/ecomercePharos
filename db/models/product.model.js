import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 15,
        lowercase: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 15,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        secure_url: String,
        public_id: String
    },
    images: [{
        secure_url: String,
        public_id: String
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    subCategoryId: {
        type: Schema.Types.ObjectId,
        ref: "subCategory",
        required: true
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: "brand",
        required: true
    },
    customId: String,
    stock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    subPrice: {
        type: Number,
    },
    rateAvg: {
        type: Number,
        default: 0
    },
    rateNum: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
})


const productModel = model("product", productSchema)

export default productModel