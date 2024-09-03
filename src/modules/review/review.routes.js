import { Router } from "express";
import * as RC from "./review.controller.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as RV from "./review.validation.js";

const reviewRouter = Router({ mergeParams: true })


reviewRouter.post("/",
    validation(RV.createReview),
    auth(),
    RC.createReview)






export default reviewRouter