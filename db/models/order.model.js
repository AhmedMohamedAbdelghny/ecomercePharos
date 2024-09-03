import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [{
        title: { type: String, required: true },
        productId: { type: Schema.Types.ObjectId, ref: "product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true }
    }],
    subTotal: { type: Number, required: true },
    couponId: {
        type: Schema.Types.ObjectId, ref: "coupon"
    },
    totalPaid: { type: Number, required: true },
    status: { type: String, enum: ["placed", "waitPayment", "onWay", "rejected", "cancelled", "delivered","pending"], default: "placed" },
    paymentMethod: { type: String, enum: ["cash", "card"], default: "cash" },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    cancelledBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    reason: String


}, {
    timestamps: true
})


const orderModel = model("order", orderSchema)

export default orderModel