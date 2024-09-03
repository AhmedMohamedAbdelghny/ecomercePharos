
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import productModel from './../../../db/models/product.model.js';
import cartModel from './../../../db/models/cart.model.js';




export const createCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body

    const productExist = await productModel.findOne({ _id: productId, stock: { $gte: quantity } })
    if (!productExist) {
        return next(new AppError("product not exist or out of stock", 404))
    }


    const cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart) {
        const newCart = await cartModel.create({ userId: req.user._id, products: [{ productId, quantity }] })
        return res.status(201).json({ msg: "done", data: newCart })
    }


    let flag = false

    for (const product of cart.products) {
        if (product.productId == productId) {
            product.quantity = quantity
            flag = true
            break;
        }
    }

    if (!flag) {
        cart.products.push({ productId, quantity })
    }


    await cart.save()


    return res.status(201).json({ msg: "done", data: cart })

})


export const removeCart = asyncHandler(async (req, res, next) => {
    const { productId } = req.body

    const cart = await cartModel.findOne({
        userId: req.user._id,
        "products.productId": productId
    })
    if (!cart) {
        return next(new AppError("cart not exist or product not found in cart", 404))
    }

    const newCart = await cartModel.findOneAndUpdate({ userId: req.user._id }, {
        $pull: { products: { productId } },
    }, { new: true })

    return res.status(201).json({ msg: "done", data: newCart })

})


export const clearCart = asyncHandler(async (req, res, next) => {


    const cart = await cartModel.findOne({
        userId: req.user._id,
    })
    if (!cart) {
        return next(new AppError("cart not exist", 404))
    }

    const newCart = await cartModel.findOneAndUpdate({ userId: req.user._id }, {
        product: [],
    }, { new: true })

    return res.status(201).json({ msg: "done", data: newCart })

})

