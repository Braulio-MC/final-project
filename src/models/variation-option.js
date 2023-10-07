import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"

const variationOption = sequelize.define("variation_option", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default variationOption