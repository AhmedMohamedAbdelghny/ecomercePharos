import { Router } from "express";
import * as COC from "./cart.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as CAC from "./cart.validation.js";

const cartRouter = Router()


cartRouter.post("/",
    validation(CAC.createCart),
    auth(),
    COC.createCart)

cartRouter.patch("/",
    validation(CAC.removeCart),
    auth(),
    COC.removeCart)
cartRouter.put("/",

    auth(),
    COC.clearCart)




export default cartRouter