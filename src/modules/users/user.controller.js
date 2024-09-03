import userModel from "../../../db/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import jwt from 'jsonwebtoken';
import { sendEmail } from './../../service/sendEmail.js';
import bcrypt from 'bcrypt';
import { customAlphabet, nanoid } from "nanoid";


export const signUp = asyncHandler(async (req, res, next) => {
    const { name, email, password, age, address, phone } = req.body
    const userExist = await userModel.findOne({ email: email.toLowerCase() })
    if (userExist) {
        return next(new AppError("email already exist", 409))
    }
    const token = jwt.sign({ email }, process.env.signatureToken, { expiresIn: 60 * 2 })
    const link = `${req.protocol}://${req.headers.host}/users/verify/${token}`
    const rfToken = jwt.sign({ email }, process.env.signatureTokenRef)
    const rfLink = `${req.protocol}://${req.headers.host}/users/refreshToken/${rfToken}`
    await sendEmail(email, "verify your email", `<a href="${link}">verify your email</a> <br>
        <a href="${rfLink}">re send link</a>`)
    const hash = bcrypt.hashSync(password, +process.env.saltRounds)
    const user = await userModel.create({ name, email, password: hash, age, address, phone })
    return res.status(201).json({ msg: "user created successfully", user })

})

export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    if (!token) {
        return next(new AppError(" token nor exist", 404))
    }
    const decoded = jwt.verify(token, process.env.signatureToken)
    if (!decoded?.email) {
        return next(new AppError("invalid token", 400))
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true }, { new: true })
    if (!user) {
        return next(new AppError("email already confirmed or not exist", 409))
    }
    return res.status(200).json({ msg: "done", })
})


export const refreshToken = asyncHandler(async (req, res, next) => {
    const { rfToken } = req.params
    if (!rfToken) {
        return next(new AppError(" token not exist", 404))
    }
    const decoded = jwt.verify(rfToken, process.env.signatureTokenRef)
    if (!decoded?.email) {
        return next(new AppError("invalid token", 400))
    }
    const user = await userModel.findOne({ email: decoded.email, confirmed: false })
    if (!user) {
        return next(new AppError("email already confirmed or not exist", 400))
    }
    const token = jwt.sign({ email: decoded.email }, process.env.signatureToken, { expiresIn: 60 * 2 })
    const link = `${req.protocol}://${req.headers.host}/users/verify/${token}`
    await sendEmail(decoded.email, "verify your email", `<a href="${link}">verify your email</a>`)
    return res.status(200).json({ msg: "done" })
})


export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body

    const user = await userModel.findOne({ email: email.toLowerCase(), confirmed: true })
    if (!user) {
        return next(new AppError("email not exist or not confirmed yet", 404))
    }

    const generateCode = customAlphabet("0123456789", 4)
    const code = generateCode()

    await sendEmail(email, "forget password", `<h1> code : ${code}</h1>`)
    await userModel.updateOne({ email: email.toLowerCase() }, { code: code })

    return res.status(200).json({ msg: "done" })
})



export const resetPassword = asyncHandler(async (req, res, next) => {

    const { email, code, password } = req.body

    const user = await userModel.findOne({ email: email.toLowerCase() })
    if (!user || code == "") {
        return next(new AppError("email not exist or invalid code", 404))
    }
    if (user.code !== code) {
        return next(new AppError("code not correct", 404))
    }

    const hash = bcrypt.hashSync(password, +process.env.saltRounds)
    await userModel.updateOne({ email: email.toLowerCase() }, { password: hash, code: "", passwordChangedAt: Date.now() })

    return res.status(200).json({ msg: "done" })
})




export const signIn = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body

    const user = await userModel.findOne({ email: email.toLowerCase(), confirmed: true })
    if (!user) {
        return next(new AppError("email not exist or not confirmed", 404))
    }

    const match = bcrypt.compareSync(password, user.password)
    if (!match) {
        return next(new AppError("password not correct", 404))
    }

    const token = jwt.sign({ email, id: user._id, role: user.role }, process.env.signatureToken)
    await userModel.updateOne({ email: email.toLowerCase() }, { loggedIn: true })

    return res.status(200).json({ msg: "done", token })
})




