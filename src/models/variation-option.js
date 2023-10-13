import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import variations from "./variation.js"

const variationOptions = sequelize.define("variation_options", {
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
    // variation_id
})

variations.hasMany(variationOptions, {
    foreignKey: "variation_id"
})

variationOptions.belongsTo(variations, {
    foreignKey: "variation_id"
})

export default variationOptions