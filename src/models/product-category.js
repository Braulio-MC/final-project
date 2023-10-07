import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import product from "./product.js"
import variation from "./variation.js"

const productCategory = sequelize.define("product_category", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

productCategory.hasMany(productCategory, {
    foreignKey: {
        name: "parent_category_id",
        allowNull: true
    },
    as: "child_categories"
})

productCategory.belongsTo(productCategory, {
    foreignKey: {
        name: "parent_category_id",
        allowNull: true
    },
    as: "parent_categories"
})

productCategory.hasMany(product, {
    foreignKey: "category_id",
})

product.belongsTo(productCategory, {
    foreignKey: "category_id",
})

productCategory.hasMany(variation, {
    foreignKey: "category_id",
})

variation.belongsTo(productCategory, {
    foreignKey: "category_id",
})

export default productCategory