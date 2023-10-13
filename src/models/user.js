import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"

const users = sequelize.define("users", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    }
})

export default users