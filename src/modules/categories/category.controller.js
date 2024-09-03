import categoryModel from "../../../db/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import { customAlphabet, nanoid } from "nanoid";
import cloudinary from './../../utils/cloudinary.js';
import slugify from "slugify";
import subCategoryModel from "../../../db/models/subCategory.model.js";


export const createCategory = asyncHandler(async (req, res, next) => {
    const { title } = req.body

    const categoryExist = await categoryModel.findOne({ title: title.toLowerCase() })
    if (categoryExist) {
        return next(new AppError("category already exist", 409))
    }

    if (!req.file) {
        return next(new AppError("image is required", 400))
    }

    const customId = nanoid(4)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `pharos/categories/${customId}`
    })
    req.filePath = `pharos/categories/${customId}`


    const category = await categoryModel.create({
        title,
        slug: slugify(title, {
            replacement: "_",
            lower: true
        }),
        image: { secure_url, public_id },
        createdBy: req.user._id,
        customId
    })
    req.data = {
        model: categoryModel,
        id: category._id
    }


    return res.status(201).json({ msg: "done", data: category })

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


export const getCategories = asyncHandler(async (req, res, next) => {


    const categories = await categoryModel.find({}).populate([
        {
            path: "subCategory"
        }
    ])
    // let arr = []
    // for (let category of categories) {
    //     const subCategories = await subCategoryModel.find({ categoryId: category._id })
    //     category = category.toObject()
    //     category.subCategories = subCategories
    //     arr.push(category)

    // }

    return res.status(201).json({ msg: "done", data: categories })

})



export const deleteCategory = asyncHandler(async (req, res, next) => {

    const category = await categoryModel.findByIdAndDelete(req.params.id)
    if (!category) {
        return next(new AppError("category not exist", 409))
    }
    await subCategoryModel.deleteMany({ categoryId: category._id })


    await cloudinary.api.delete_resources_by_prefix(`pharos/categories/${category.customId}`)
    await cloudinary.api.delete_folder(`pharos/categories/${category.customId}`)


    return res.status(201).json({ msg: "done" })

})
