import { Router } from "express";
import * as OC from "./order.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as CAC from "./order.validation.js";

const orderRouter = Router()


orderRouter.post("/",
    // validation(CAC.createOrder),
    auth(),
    OC.createOrder)

orderRouter.patch("/:orderId",
    // validation(CAC.createOrder),
    auth(),
    OC.cancelOrder)





export default orderRouter