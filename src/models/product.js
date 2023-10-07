import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import promotion from "./promotion.js"
import shoppingSessionItem from "./shopping-session-item.js"
import orderLine from "./order-line.js"

const product = sequelize.define("product", {
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
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Minimum price must be equal to 0"
            }
        }
    }
})

product.hasOne(shoppingSessionItem, {
    foreignKey: "product_id"
})

shoppingSessionItem.belongsTo(product, {
    foreignKey: "product_id"
})

product.hasOne(orderLine, {
    foreignKey: "product_id"
})

orderLine.belongsTo(product, {
    foreignKey: "product_id"
})

// product.hasOne(promotion, {
//     foreignKey: "promotion_id",
//     sourceKey: "id"
// })

// promotion.belongsTo(product, {
//     foreignKey: "promotion_id", 
//     targetKey: "id"
// })

export default product