import { Router } from "express";
import * as CC from "./category.controller.js";
import { auth } from "../../middleware/auth.js";
import { multerHost, validExtensions } from './../../middleware/multer.js';
import subCategoryRouter from './../subCategories/subCategory.routes.js';
import { roles } from "../../utils/roles.js";

const categoryRouter = Router({ caseSensitive: true })


categoryRouter.use("/:categoryId/subCategories", subCategoryRouter)

categoryRouter.post("/",
    auth(Object.values(roles)),//["Admin", "User"],
    multerHost(validExtensions.image).single("image"),
    CC.createCategory)

categoryRouter.patch("/:id",
    auth(roles.admin),
    multerHost(validExtensions.image).single("image"),
    CC.updateCategory)


categoryRouter.get("/", CC.getCategories)


categoryRouter.delete("/:id", CC.deleteCategory)


export default categoryRouter