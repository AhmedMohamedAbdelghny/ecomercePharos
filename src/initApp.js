
import connectionDB from './../db/connection.js';
import { auth } from './middleware/auth.js';
import * as routes from './modules/index.routes.js';
import { GlobalErrorHandler } from './utils/asyncHandler.js';
import { AppError } from './utils/classError.js';
import { deleteFromCloudinary } from './utils/deleteFromCloudinary.js';
import { deleteFromDb } from './utils/deleteFromDb.js';
import cors from "cors"

export const initApp = (app, express) => {

    app.use(cors())
    app.use((req, res, next) => {
        if (req.originalUrl == "/orders/webhook") {
            next()
        } else {
            express.json()(req, res, next)
        }
    });


    // app.set('case sensitive routing', true);

    app.get("/", (req, res) => {
        return res.status(200).json({
            msg: "Hello on my ecommerce project"
        })
    })

    app.use("/users", routes.userRouter)
    app.use("/categories", routes.categoryRouter)
    app.use("/subCategories", routes.subCategoryRouter)
    app.use("/brands", routes.brandRouter)
    app.use("/products", routes.productRouter)
    app.use("/coupons", routes.couponRouter)
    app.use("/carts", routes.cartRouter)
    app.use("/orders", routes.orderRouter)




    //connect to db
    connectionDB()

    //handle invalid URLs.
    app.use("*", (req, res, next) => {
        next(new AppError(`inValid url ${req.originalUrl}`))
    })

    //GlobalErrorHandler
    app.use(GlobalErrorHandler, deleteFromCloudinary, deleteFromDb)


}