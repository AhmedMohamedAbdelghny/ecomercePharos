import { Schema, model } from "mongoose";

const wishListSchema = new Schema({


    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [{ type: Schema.Types.ObjectId, ref: "product" }],




}, {
    timestamps: true
})


const wishListModel = model("wishList", wishListSchema)

export default wishListModel