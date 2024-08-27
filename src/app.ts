import 'reflect-metadata'
import express from 'express'
// import cors from "cors"
import helmet from 'helmet'
// import swaggerUI from "swagger-ui-express"
// import swaggerJSDoc from "swagger-jsdoc"
// import { appVars } from "./config/configuration.js"
import userRoutes from './routes/User.routes'
import paymentRoutes from './routes/Payment.routes'
import storeRoutes from './routes/Store.routes'
import productRoutes from './routes/Product.routes'
import deliveryLocationRoutes from './routes/DeliveryLocation.routes'
import orderRoutes from './routes/Order.routes'
import orderlineRoutes from './routes/Orderline.routes'
import categoryRoutes from './routes/Category.routes'
import cartRoutes from './routes/ShoppingCart.routes'
import cartItemRoutes from './routes/ShoppingCartItem.routes'
import discountRoutes from './routes/Discount.routes'
import productReviewRoutes from './routes/ProductReview.routes'
import productFavoriteRoutes from './routes/ProductFavorite.routes'
import storeReviewRoutes from './routes/StoreReview.routes'
import storeFavoriteRoutes from './routes/StoreFavorite.routes'
import searchRoutes from './routes/Search.routes'
import tokenRoutes from './routes/Token.routes'
import channelRoutes from './routes/Channel.routes'
import errorHandler from './middleware/error.middleware'
import notFoundHandler from './middleware/not-found.middleware'
import { checkIncomingJson } from './core/Utils'
import { createMappings } from './core/Mapper'

const app = express()

createMappings()
app.use(helmet())
app.use(express.json({
  verify: checkIncomingJson
}))
app.use(paymentRoutes)
app.use(storeRoutes)
app.use(productRoutes)
app.use(deliveryLocationRoutes)
app.use(orderRoutes)
app.use(orderlineRoutes)
app.use(categoryRoutes)
app.use(cartRoutes)
app.use(cartItemRoutes)
app.use(discountRoutes)
app.use(productReviewRoutes)
app.use(productFavoriteRoutes)
app.use(storeReviewRoutes)
app.use(storeFavoriteRoutes)
app.use(searchRoutes)
app.use(tokenRoutes)
app.use(channelRoutes)
app.use(userRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app

// const swaggerOptions = {
//     definition: {
//         openapi: "3.0.0",
//         info: {
//             title: "Final project",
//             version: "1.0.0",
//         },
//         servers: [{
//             url: `http://localhost:${appVars.develPort}`,
//             description: "API Documentation",
//         },],
//     },
//     apis: [
//         "src/routes/delivery-location.js",
//         "src/routes/order.routes.js",
//         "src/routes/payment.routes.js",
//         "src/routes/product.routes.js",
//         "src/routes/role.routes.js",
//         "src/routes/stores.routes.js",
//         "src/routes/user.routes.js"
//     ],
// }
// const corsOptions = {
//     origin: "*",  // Do not use this in production
//     methods: ["GET", "PUT", "POST", "DELETE"],
//     allowedHeaders: ["Authorization", "Content-Type"],
//     maxAge: 43200  // 12 hrs
// }
// const specs = swaggerJSDoc(swaggerOptions)

// app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs))
// app.use(cors(corsOptions))
