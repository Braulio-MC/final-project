import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import shoppingSessions from "./shopping-session.js"
import products from "./product.js"

const shoppingSessionItems = sequelize.define("shopping_session_items", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Quantity must be greater than 0"
            }
        }
    }
    // product_id
    // shopping_session_id
})

products.hasOne(shoppingSessionItems, {
    foreignKey: "product_id"
})

shoppingSessionItems.belongsTo(products, {
    foreignKey: "product_id"
})

shoppingSessions.hasMany(shoppingSessionItems, {
    foreignKey: "shopping_session_id",
})

shoppingSessionItems.belongsTo(shoppingSessions, {
    foreignKey: "shopping_session_id",
})

export default shoppingSessionItems