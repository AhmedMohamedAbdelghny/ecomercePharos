import { Router } from "express";
import * as UC from "./user.controller.js";

const userRouter = Router()


userRouter.post("/signUp", UC.signUp)
userRouter.get("/verify/:token", UC.confirmEmail)
userRouter.get("/refreshToken/:rfToken", UC.refreshToken)
userRouter.patch("/sendCode", UC.forgetPassword)
userRouter.patch("/resetPassword", UC.resetPassword)
userRouter.post("/signIn", UC.signIn)


export default userRouter