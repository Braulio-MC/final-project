import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import productCategories from "./product-category.js"

const variations = sequelize.define("variations", {
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
    // category_id
})

/*
 Variations are like:
    Name: Color
    Value: Black
    Name: Size
    Value: M
 Linked to a product category
 */

productCategories.hasMany(variations, {
    foreignKey: "category_id",
})

variations.belongsTo(productCategories, {
    foreignKey: "category_id",
})

export default variations