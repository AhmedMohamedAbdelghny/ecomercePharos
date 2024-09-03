import categoryModel from "../../../db/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import { customAlphabet, nanoid } from "nanoid";
import cloudinary from '../../utils/cloudinary.js';
import slugify from "slugify";
import subCategoryModel from "../../../db/models/subCategory.model.js";


export const createSubCategory = asyncHandler(async (req, res, next) => {
    const { title } = req.body
    const { categoryId } = req.params

    const categoryExist = await categoryModel.findById({ _id: categoryId })
    if (!categoryExist) {
        return next(new AppError("category not exist", 404))
    }

    const subCategoryExist = await subCategoryModel.findOne({ title: title.toLowerCase() })
    if (subCategoryExist) {
        return next(new AppError("subCategory already exist", 409))
    }

    if (!req.file) {
        return next(new AppError("image is required", 400))
    }

    const customId = nanoid(4)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `pharos/categories/${categoryExist.customId}/subCategories/${customId}`
    })

    const subCategory = await subCategoryModel.create({
        title,
        slug: slugify(title, {
            replacement: "_",
            lower: true
        }),
        image: { secure_url, public_id },
        createdBy: req.user._id,
        categoryId,
        customId
    })


    return res.status(201).json({ msg: "done", data: subCategory })

})


export const updateCategory = asyncHandler(async (req, res, next) => {
    const { title } = req.body

    const category = await categoryModel.findById(req.params.id)
    if (!category) {
        return next(new AppError("category not exist", 409))
    }

    if (title) {
        if (title.toLowerCase() == category.title) {
            return next(new AppError("title must be different", 409))
        }
        if (await categoryModel.findOne({ title: title.toLowerCase() })) {
            return next(new AppError("category already exist", 409))
        }
        category.title = title.toLowerCase()
        category.slug = slugify(title, {
            replacement: "_",
            lower: true
        })
    }


    if (req.file) {
        await cloudinary.uploader.destroy(category.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `pharos/categories/${category.customId}`
        })
        category.image = { secure_url, public_id }
    }


    await category.save()


    return res.status(201).json({ msg: "done", data: category })

})



export const getSubCategories = asyncHandler(async (req, res, next) => {


    const subCategories = await subCategoryModel.find({}).populate([
        {
            path: "categoryId",
            select: "title"
        }
    ])

    return res.status(201).json({ msg: "done", data: subCategories })

})
