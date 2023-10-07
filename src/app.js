import express from "express"
import cors from "cors"
import helmet from "helmet"
import usersRoutes from "./routes/users.routes.js"
import rolesRoutes from "./routes/roles.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import errorHandler from "./middleware/error.middleware.js"
import notFoundHandler from "./middleware/not-found.middleware.js"
import ApiError from "./common/error.js"
import { BAD_REQUEST } from "./common/constants.js"

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
            throw new ApiError(BAD_REQUEST, "Invalid JSON")
        }
    }
}))
app.use(usersRoutes)
app.use(rolesRoutes)
app.use(paymentRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app