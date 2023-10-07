import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import variationOption from "./variation-option.js"

const variation = sequelize.define("variation", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

/*
 Variations are like:
    Name: Color
    Value: Black
    Name: Size
    Value: M
 Linked to a product category
 */

variation.hasMany(variationOption, {
    foreignKey: "variation_id",
})

variationOption.belongsTo(variation, {
    foreignKey: "variation_id",
})

export default variation