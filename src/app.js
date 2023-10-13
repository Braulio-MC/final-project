import express from "express"
import cors from "cors"
import helmet from "helmet"
import { StatusCodes } from "http-status-codes"
import usersRoutes from "./routes/user.routes.js"
import rolesRoutes from "./routes/role.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import storeRoutes from "./routes/store.routes.js"
import productRoutes from "./routes/product.routes.js"
import countryRoutes from "./routes/country.routes.js"
import errorHandler from "./middleware/error.middleware.js"
import notFoundHandler from "./middleware/not-found.middleware.js"
import ApiError from "./common/error.js"

const app = express()

app.use(cors({
    origin: "*",  // Do not use this in production
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 43200  // 12 hrs
}))
app.use(helmet())
app.use(express.json({
    verify: (req, res, buf, encoding) => {
        try {
            JSON.parse(buf)
        } catch (err) {
            throw new ApiError("Invalid JSON", StatusCodes.BAD_REQUEST)
        }
    }
}))
app.use(usersRoutes)
app.use(rolesRoutes)
app.use(paymentRoutes)
app.use(storeRoutes)
app.use(productRoutes)
app.use(countryRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app