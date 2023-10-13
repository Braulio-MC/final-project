import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import orderDetails from "./order-details.js"
import products from "./product.js"

const orderLines = sequelize.define("order_lines", {
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
                msg: "Minimum quantity cannot be less than 0"
            }
        }
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Total cannot be less than 0"
            }
        }
    }
    // order_id
    // product_id
})

orderDetails.hasMany(orderLines, {
    foreignKey: "order_id"
})

orderLines.belongsTo(orderDetails, {
    foreignKey: "order_id"
})

products.hasMany(orderLines, {
    foreignKey: "product_id"
})

orderLines.belongsTo(products, {
    foreignKey: "product_id"
})

export default orderLines