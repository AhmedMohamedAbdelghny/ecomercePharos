
import orderModel from "../../../db/models/order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import productModel from '../../../db/models/product.model.js';
import couponModel from './../../../db/models/coupon.model.js';
import cartModel from "../../../db/models/cart.model.js";
import createInvoice from './../../utils/pdf.js';
import { sendEmail } from "../../service/sendEmail.js";



export const createOrder = asyncHandler(async (req, res, next) => {
    const { productId, quantity, phone, address, couponCode, paymentMethod } = req.body

    if (couponCode) {
        const coupon = await couponModel.findOne({
            code: couponCode,
            usedBy: { $nin: [req.user._id] }
        })
        if (!coupon || coupon.toDate < new Date()) {
            return next(new AppError("Coupon not valid or expired", 400))
        }
        req.body.coupon = coupon
    }

    let dummyProducts = []
    let flag = false

    if (productId) {
        dummyProducts = [{ productId, quantity }]
    } else {
        const cart = await cartModel.findOne({ userId: req.user._id })
        if (!cart?.products.length) {
            return next(new AppError("cart is empty please select productId", 400))
        }
        flag = true
        dummyProducts = cart.products
    }

    let finalProducts = []
    let subTotal = 0
    for (let product of dummyProducts) {

        const checkProduct = await productModel.findOne({ _id: product.productId, stock: { $gte: product.quantity } })
        if (!checkProduct) {
            return next(new AppError("product not exist or out of stock", 404))
        }
        if (flag) {
            product = product.toObject()
        }
        product.title = checkProduct.title
        product.price = checkProduct.subPrice
        product.totalPrice = checkProduct.subPrice * product.quantity
        finalProducts.push(product)
        subTotal += product.totalPrice
    }


    const order = await orderModel.create({
        userId: req.user._id,
        products: finalProducts,
        subTotal,
        couponId: req?.body?.coupon?._id,
        totalPaid: subTotal - (subTotal * ((req?.body?.coupon?.amount || 0) / 100)),
        phone,
        address,
        paymentMethod,
        status: paymentMethod == "cash" ? "placed" : "waitPayment"
    })

    for (const product of finalProducts) {
        await productModel.findOneAndUpdate({ _id: product.productId }, { $inc: { stock: -product.quantity } })
    }

    if (req.body?.coupon) {
        await couponModel.updateOne({ code: couponCode }, { $push: { usedBy: req.user._id } })
    }

    if (flag = true) {
        await cartModel.findOneAndUpdate({ userId: req.user._id }, { products: [] })
    }


    // generate pdf


    const invoice = {
        shipping: {
            name: req.user.name,
            address: req.user.address,
            city: "Alex",
            state: "Cairo",
            country: "Cairo",
            postal_code: 94111
        },
        items: order.products,
        subtotal: order.subTotal,
        paid: order.totalPaid,
        invoice_nr: order._id,
        data: order.createdAt,
        coupon: req.body?.coupon?.amount
    };

    await createInvoice(invoice, "invoice.pdf");

    await sendEmail(req.user.email, "order", "invoice.pdf", [
        {
            path: "invoice.pdf",
            contentType: "application/pdf",
        }
    ])

    return res.status(201).json({ msg: "done", data: order })

})


export const cancelOrder = asyncHandler(async (req, res, next) => {
    const { orderId } = req.params
    const { reason } = req.body

    const order = await orderModel.findOneAndUpdate({ _id: orderId, userId: req.user._id }, {
        status: "cancelled",
        cancelledBy: req.user._id,
        reason
    })
    if (!order) {
        return next(new AppError("order not exist or you not authorized", 404))
    }

    for (const product of order.products) {
        await productModel.findOneAndUpdate({ _id: product.productId }, { $inc: { stock: product.quantity } })
    }



    if (order?.couponId) {
        await couponModel.updateOne({ _id: order?.couponId }, { $pull: { usedBy: req.user._id } })
    }

    return res.status(200).json({ msg: "done" })


})


