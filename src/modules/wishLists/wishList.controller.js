
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import productModel from '../../../db/models/product.model.js';
import orderModel from '../../../db/models/order.model.js';
import wishListModel from './../../../db/models/wishList.model.js';




export const createWishList = asyncHandler(async (req, res, next) => {

    const { productId } = req.params

    const productExist = await productModel.findOne({ _id: productId })
    if (!productExist) {
        return next(new AppError("product not exist ", 404))
    }

    const wishListExist = await wishListModel.findOne({ userId: req.user._id })
    if (!wishListExist) {

        const newWishList = await wishListModel.create({
            userId: req.user._id,
            products: [productId]
        })
        return res.status(201).json({ msg: "done", data: newWishList })

    }

    const wishList = await wishListModel.findOneAndUpdate({ userId: req.user._id },
        { $addToSet: { products: productId } },
        { new: true })

    return res.status(201).json({ msg: "done", data: wishList })

})

