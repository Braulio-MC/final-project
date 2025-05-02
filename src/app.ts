import express from 'express'
import helmet from 'helmet'
import userRoutes from './routes/User.routes'
import tokenRoutes from './routes/Token.routes'
import channelRoutes from './routes/Channel.routes'
import errorHandler from './middleware/error.middleware'
import notFoundHandler from './middleware/not-found.middleware'
import { checkIncomingJson } from './core/Utils'

const app = express()

app.use(helmet())
app.use(express.json({ verify: checkIncomingJson }))
app.use(tokenRoutes)
app.use(channelRoutes)
app.use(userRoutes)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
