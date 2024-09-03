import { Router } from "express";
import * as PC from "./product.controller.js";
import { auth } from "../../middleware/auth.js";
import { multerHost, validExtensions } from '../../middleware/multer.js';
import reviewRouter from "../review/review.routes.js";
import wishListRouter from './../wishLists/wishList.routes.js';

const productRouter = Router({ mergeParams: true })


productRouter.use("/:productId/reviews", reviewRouter)
productRouter.use("/:productId/wishLists", wishListRouter)

productRouter.post("/",
    auth(),
    multerHost(validExtensions.image).fields([
        { name: "image", maxCount: 1 },
        { name: "images", maxCount: 3 },
    ]),
    PC.createProduct)


productRouter.patch("/:id",
    auth(),
    multerHost(validExtensions.image).fields([
        { name: "image", maxCount: 1 },
        { name: "images", maxCount: 3 },
    ]),
    PC.updateProduct)



productRouter.get("/", PC.getProducts)


export default productRouter