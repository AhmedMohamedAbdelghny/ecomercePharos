import { Router } from "express";
import * as COC from "./coupon.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as COV from "./coupon.validation.js";

const couponRouter = Router()


couponRouter.post("/",
    validation(COV.createCoupon),
    auth(),
    COC.createCoupon)

couponRouter.patch("/:id",
    validation(COV.updateCoupon),
    auth(),
    COC.updateCoupon)




export default couponRouter