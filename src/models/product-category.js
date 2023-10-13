import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import promotions from "./promotion.js"
import stores from "./store.js"

const productCategories = sequelize.define("product_categories", {
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
    // parent_category_id
    // promotion_id
    // store_id
})

productCategories.hasMany(productCategories, {
    foreignKey: {
        name: "parent_category_id",
        allowNull: true
    },
    as: "child_categories"
})

productCategories.belongsTo(productCategories, {
    foreignKey: {
        name: "parent_category_id",
        allowNull: true
    },
    as: "parent_categories"
})

promotions.hasMany(productCategories, {
    foreignKey: "promotion_id"
})

productCategories.belongsTo(promotions, {
    foreignKey: "promotion_id"
})

stores.hasMany(productCategories, {
    foreignKey: "store_id"
})

productCategories.belongsTo(stores, {
    foreignKey: "store_id"
})

export default productCategories