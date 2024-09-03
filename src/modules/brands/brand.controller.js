import brandModel from "../../../db/models/brand.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import { customAlphabet, nanoid } from "nanoid";
import cloudinary from '../../utils/cloudinary.js';
import slugify from "slugify";


export const createBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body

    const brandExist = await brandModel.findOne({ name: name.toLowerCase() })
    if (brandExist) {
        return next(new AppError("brand already exist", 409))
    }

    if (!req.file) {
        return next(new AppError("image is required", 400))
    }

    const customId = nanoid(4)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `pharos/Brands/${customId}`
    })

    const brand = await brandModel.create({
        name,
        slug: slugify(name, {
            replacement: "_",
            lower: true
        }),
        image: { secure_url, public_id },
        createdBy: req.user._id,
        customId
    })


    return res.status(201).json({ msg: "done", data: brand })

})

