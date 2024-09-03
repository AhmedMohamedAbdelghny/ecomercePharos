
import joi from 'joi';
import { generalFiled } from '../../utils/generalFields.js';


export const createReview = {
    body: joi.object({
        rate: joi.number().min(1).max(5).integer().required(),

        comment: joi.string().required(),
    }).required(),
    params: joi.object({
        productId: generalFiled.id.required(),
    }).required(),
    headers: generalFiled.headers.required()
}
