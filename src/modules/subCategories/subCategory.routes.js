import { Router } from "express";
import * as CC from "./subCategory.controller.js";
import { auth } from "../../middleware/auth.js";
import { multerHost, validExtensions } from '../../middleware/multer.js';

const subCategoryRouter = Router({ mergeParams: true })


subCategoryRouter.post("/",
    auth(),
    multerHost(validExtensions.image).single("image"),
    CC.createSubCategory)


subCategoryRouter.get("/", CC.getSubCategories)

export default subCategoryRouter