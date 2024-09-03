import userRouter from "./users/user.routes.js";
import categoryRouter from './categories/category.routes.js';
import subCategoryRouter from './subCategories/subCategory.routes.js';
import brandRouter from './brands/brand.routes.js';
import productRouter from './products/product.routes.js';
import couponRouter from './coupon/coupon.routes.js';
import cartRouter from './carts/cart.routes.js';
import orderRouter from './orders/order.routes.js';
import reviewRouter from './review/review.routes.js';
import wishListRouter from './wishLists/wishList.routes.js';



export {
    userRouter,
    categoryRouter,
    subCategoryRouter,
    brandRouter,
    productRouter,
    couponRouter,
    cartRouter,
    orderRouter,
    reviewRouter,
    wishListRouter
}