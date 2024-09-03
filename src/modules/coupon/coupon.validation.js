
import joi from 'joi';
import { generalFiled } from '../../utils/generalFields.js';


export const createCoupon = {
    body: joi.object({
        code: joi.string().min(3).max(15).required(),
        amount: joi.number().integer().min(1).max(100).required(),
        fromDate: joi.date().greater(new Date()).required(),
        toDate: joi.date().greater(joi.ref("fromDate")).required()
    }).required(),
    headers: generalFiled.headers.required()
}

export const updateCoupon = {
    body: joi.object({
        code: joi.string().min(3).max(15),
        amount: joi.number().integer().min(1).max(100),
        fromDate: joi.date().greater(new Date()),
        toDate: joi.date().greater(joi.ref("fromDate"))
    }),
    params: joi.object({
        id: generalFiled.id.required(),
    }).required(),
    headers: generalFiled.headers.required()
}