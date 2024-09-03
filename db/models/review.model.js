import { Schema, model } from "mongoose";

const reviewSchema = new Schema({


    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    productId: { type: Schema.Types.ObjectId, ref: "product", required: true },
    comment: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }



}, {
    timestamps: true
})


const reviewModel = model("review", reviewSchema)

export default reviewModel