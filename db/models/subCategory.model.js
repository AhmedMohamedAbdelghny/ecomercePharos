import { Schema, model } from "mongoose";

const subCategorySchema = new Schema({
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
    image: {
        secure_url: String,
        public_id: String
    },
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
    customId: String

}, {
    timestamps: true
})


const subCategoryModel = model("subCategory", subCategorySchema)

export default subCategoryModel