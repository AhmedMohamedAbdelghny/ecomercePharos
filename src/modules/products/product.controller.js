import categoryModel from "../../../db/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import { customAlphabet, nanoid } from "nanoid";
import cloudinary from '../../utils/cloudinary.js';
import slugify from "slugify";
import productModel from "../../../db/models/product.model.js";
import subCategoryModel from "../../../db/models/subCategory.model.js";
import brandModel from "../../../db/models/brand.model.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";


export const createProduct = asyncHandler(async (req, res, next) => {
    const { title, description, categoryId, subCategoryId, brandId, stock, price, discount } = req.body

    const categoryExist = await categoryModel.findById({ _id: categoryId })
    if (!categoryExist) {
        return next(new AppError("category not exist", 404))
    }
    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategoryId, categoryId })
    if (!subCategoryExist) {
        return next(new AppError("subCategory not exist", 404))
    }
    const brandExist = await brandModel.findById({ _id: brandId })
    if (!brandExist) {
        return next(new AppError("brand not exist", 404))
    }

    const productExist = await productModel.findOne({ title: title.toLowerCase(), createdBy: req.user._id })
    if (productExist) {
        return next(new AppError("product already exist", 409))
    }


    if (!req.files) {
        return next(new AppError("image is required", 400))
    }

    const customId = nanoid(4)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: `pharos/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/image`
    })

    let arr = []
    for (const file of req.files.images) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `pharos/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/images`
        })

        arr.push({ secure_url, public_id })
    }


    // 200 * 40/100
    let subPrice = price - (price * ((discount || 0) / 100))

    const product = await productModel.create({
        title,
        slug: slugify(title, {
            replacement: "_",
            lower: true
        }),
        description,
        subPrice,
        stock,
        price,
        discount,
        image: { secure_url, public_id },
        images: arr,
        createdBy: req.user._id,
        categoryId,
        brandId,
        subCategoryId,
        customId
    })


    return res.status(201).json({ msg: "done", data: product })

})



export const getProducts = asyncHandler(async (req, res, next) => {
    const apiFeature = new ApiFeatures(productModel.find(), req.query)
        .pagination()
        .filter()
        .search()
        .sort()
        .select()

    const products = await apiFeature.mongooseQuery
    return res.status(200).json({ msg: "done", page: apiFeature.page, data: products })
})




export const updateProduct = asyncHandler(async (req, res, next) => {
    const { title, description, categoryId, subCategoryId, brandId, stock, price, discount } = req.body

    const { id } = req.params

    const categoryExist = await categoryModel.findById({ _id: categoryId })
    if (!categoryExist) {
        return next(new AppError("category not exist", 404))
    }
    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategoryId, categoryId })
    if (!subCategoryExist) {
        return next(new AppError("subCategory not exist", 404))
    }
    const brandExist = await brandModel.findById({ _id: brandId })
    if (!brandExist) {
        return next(new AppError("brand not exist", 404))
    }

    const product = await productModel.findOne({ _id: id, createdBy: req.user._id })//owner
    if (!product) {
        return next(new AppError("product not exist or you are not owner", 409))
    }


    if (title) {
        if (product.title == title.toLowerCase()) {
            return next(new AppError("title must be different", 409))
        }
        if (await productModel.findOne({ title: title.toLowerCase() })) {
            return next(new AppError("title already exist", 409))
        }
        product.title = title.toLowerCase()
        product.slug = slugify(title, {
            replacement: "_",
            lower: true
        })
    }

    if (description) {
        product.description = description
    }

    if (stock) {
        product.stock = stock
    }


    if (price & discount) {
        let subPrice = price - (price * ((discount || 0) / 100))
        product.subPrice = subPrice
        product.price = price
        product.discount = discount
    } else if (price) {
        let subPrice = price - (price * (product.discount / 100))
        product.subPrice = subPrice
        product.price = price
    } else if (discount) {
        let subPrice = product.price - (product.price * (discount / 100))
        product.subPrice = subPrice
        product.discount = discount
    }


    if (req?.files) {
        if (req.files?.image?.length) {
            await cloudinary.uploader.destroy(product.image.public_id)
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
                folder: `pharos/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/image`
            })
            product.image = { secure_url, public_id }
        }
        if (req.files?.images?.length) {
            await cloudinary.api.delete_resources_by_prefix(`pharos/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/images`)
            let arr = []
            for (const file of req.files.images) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: `pharos/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/images`
                })
                arr.push({ secure_url, public_id })
            }
            product.images = arr
        }
    }


    await product.save()



    return res.status(201).json({ msg: "done", data: product })

})
