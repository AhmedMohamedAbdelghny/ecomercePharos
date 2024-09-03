import { Schema, model } from "mongoose";

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 15,
        lowercase: true,
        trim: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    usedBy: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }]


}, {
    timestamps: true
})


const couponModel = model("coupon", couponSchema)

export default couponModel