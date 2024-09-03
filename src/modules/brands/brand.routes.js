import { Router } from "express";
import * as CC from "./brand.controller.js";
import { auth } from "../../middleware/auth.js";
import { multerHost, validExtensions } from '../../middleware/multer.js';

const brandRouter = Router()


brandRouter.post("/",
    auth(),
    multerHost(validExtensions.image).single("image"),
    CC.createBrand)




export default brandRouter