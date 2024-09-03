import { Router } from "express";
import * as OC from "./order.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as CAC from "./order.validation.js";
import { roles } from "../../utils/roles.js";

const orderRouter = Router()


orderRouter.post("/",
    // validation(CAC.createOrder),
    auth(Object.values(roles)),
    OC.createOrder)

orderRouter.patch("/:orderId",
    // validation(CAC.createOrder),
    auth(),
    OC.cancelOrder)





export default orderRouter