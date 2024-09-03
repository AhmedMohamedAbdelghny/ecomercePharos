
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import productModel from '../../../db/models/product.model.js';
import reviewModel from "../../../db/models/review.model.js";
import orderModel from './../../../db/models/order.model.js';




export const createReview = asyncHandler(async (req, res, next) => {
    const { rate, comment } = req.body
    const { productId } = req.params

    const productExist = await productModel.findOne({ _id: productId })
    if (!productExist) {
        return next(new AppError("product not exist ", 404))
    }

    // const reviewExist = await reviewModel.findOne({ productId, userId: req.user._id })
    // if (reviewExist) {
    //     return next(new AppError("you already added review for this product", 404))
    // }

    const order = await orderModel.findOne({
        userId: req.user._id,
        "product.productId": productId,
        // status: "delivered",
    })

    const review = await reviewModel.create({
        productId,
        userId: req.user._id,
        comment,
        rate
    })

    // const reviews = await reviewModel.find({ productId })
    // let sum = 0
    // for (const review of reviews) {
    //     sum += review.rate
    // }

    // let rateAvg = sum / reviews.length
    // productExist.rateAvg = rateAvg

    let sum = productExist.rateAvg * productExist.rateNum
    sum += rate

    productExist.rateAvg = sum / (productExist.rateNum + 1)
    productExist.rateNum++
    await productExist.save()



    return res.status(201).json({ msg: "done", data: review })

})


export const deleteReview = asyncHandler(async (req, res, next) => {

    const { id } = req.params

    const reviewExist = await reviewModel.findOneAndDelete({ _id: id, userId: req.user._id })
    if (!reviewExist) {
        return next(new AppError("review not exist or you don't have permission", 404))
    }

    const productExist = await productModel.findOne({ _id: req.params.productId })

    let sum = productExist.rateAvg * productExist.rateNum
    sum -= reviewExist.rate

    productExist.rateAvg = sum / (productExist.rateNum - 1)
    productExist.rateNum--
    await productExist.save()

    return res.status(201).json({ msg: "done" })

})

