import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"

const countries = sequelize.define("countries", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    country_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

export default countries