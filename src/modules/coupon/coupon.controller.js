import couponModel from "../../../db/models/coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";




export const createCoupon = asyncHandler(async (req, res, next) => {
    const { code, amount, fromDate, toDate } = req.body

    const couponExist = await couponModel.findOne({ code: code.toLowerCase() })
    if (couponExist) {
        return next(new AppError("coupon already exist", 409))
    }


    const coupon = await couponModel.create({ code, amount, fromDate, toDate, createdBy: req.user._id })


    return res.status(201).json({ msg: "done", data: coupon })

})


export const updateCoupon = asyncHandler(async (req, res, next) => {
    const { code, amount, fromDate, toDate } = req.body
    const { id } = req.params

    const coupon = await couponModel.findOne({ _id: id, createdBy: req.user._id })
    if (!coupon) {
        return next(new AppError("coupon not exist or you not authorized", 404))
    }

    if (code) {
        coupon.code = code
    }
    if (amount) {
        coupon.amount = amount
    }
    if (fromDate) {
        coupon.fromDate = fromDate
    }
    if (toDate) {
        coupon.toDate = toDate
    }

    await coupon.save()


    return res.status(201).json({ msg: "done", data: coupon })

})

