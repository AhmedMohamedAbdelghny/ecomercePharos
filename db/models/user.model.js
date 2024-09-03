import { Schema, model } from "mongoose";
import { roles } from "../../src/utils/roles.js";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 15,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: Object.values(roles),
        default: "user"
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 60
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    code: String,
    passwordChangedAt: Date
}, {
    timestamps: true
})


const userModel = model("user", userSchema)

export default userModel