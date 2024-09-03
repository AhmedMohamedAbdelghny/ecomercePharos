
import joi from 'joi';
import { generalFiled } from '../../utils/generalFields.js';


export const createCart = {
    body: joi.object({
        quantity: joi.number().integer().required(),
        productId: generalFiled.id.required(),
    }).required(),
    headers: generalFiled.headers.required()
}

export const removeCart = {
    body: joi.object({
      
        productId: generalFiled.id,
    }),
    headers: generalFiled.headers.required()
}