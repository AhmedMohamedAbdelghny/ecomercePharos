import { Router } from "express";
import * as OC from "./order.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as CAC from "./order.validation.js";
import { roles } from "../../utils/roles.js";
import express from "express";

const orderRouter = Router()


orderRouter.post("/",
    auth(Object.values(roles)),
    OC.createOrder)

orderRouter.patch("/:orderId",
    // validation(CAC.createOrder),
    auth(),
    OC.cancelOrder)

orderRouter.post('/webhook', express.raw({ type: 'application/json' }), OC.webhook);






export default orderRouter