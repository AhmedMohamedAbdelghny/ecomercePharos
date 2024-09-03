import { Router } from "express";
import * as RC from "./wishList.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as RV from "./wishList.validation.js";

const wishListRouter = Router({ mergeParams: true })


wishListRouter.post("/",
    // validation(RV.createWishList),
    auth(),
    RC.createWishList)





export default wishListRouter