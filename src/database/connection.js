import { Sequelize } from "sequelize"
import { dbVars } from "../config/configuration.js"

const sequelize = new Sequelize(dbVars.dbName, dbVars.dbUser, dbVars.dbPass, {
        host: dbVars.dbHost,
        dialect: dbVars.dbDialect
    }
)

export default sequelize