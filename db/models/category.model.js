import { Schema, model } from "mongoose";

const categorySchema = new Schema({
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
    customId: String

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

})


categorySchema.virtual("subCategory", {
    ref: "subCategory",
    localField: "_id",
    foreignField: "categoryId"
})

const categoryModel = model("category", categorySchema)

export default categoryModel