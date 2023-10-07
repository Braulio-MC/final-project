import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import orderLine from "./order-line.js"

const orderDetails = sequelize.define("order_details", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Total cannot be less than 0"
            }
        }
    }
})

orderDetails.hasMany(orderLine, {
    foreignKey: "order_id",
})

orderLine.belongsTo(orderDetails, {
    foreignKey: "order_id",
})

export default orderDetails