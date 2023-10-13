import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import productCategories from "./product-category.js"
import promotions from "./promotion.js"
import productInventories from "./product-inventory.js"

const products = sequelize.define("products", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT({
            length: "medium"
        }),
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    image: { 
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: {
                msg: "An URL format was expected"
            }
        }
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Minimum price cannot be less than 0"
            }
        }
    }
    // category_id
    // promotion_id
    // inventory_id
})

productCategories.hasMany(products, {
    foreignKey: "category_id"
})

products.belongsTo(productCategories, {
    foreignKey: "category_id"
})

promotions.hasMany(products, {
    foreignKey: "promotion_id"
})

products.belongsTo(promotions, {
    foreignKey: "promotion_id"
})

productInventories.hasOne(products, {
    foreignKey: "inventory_id"
})

products.belongsTo(productInventories, {
    foreignKey: "inventory_id"
})

export default products