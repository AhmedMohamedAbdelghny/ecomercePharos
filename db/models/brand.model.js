import { Schema, model } from "mongoose";

const brandSchema = new Schema({
    name: {
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
    timestamps: true
})


const brandModel = model("brand", brandSchema)

export default brandModel