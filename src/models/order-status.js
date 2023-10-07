import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import orderDetails from "./order-details.js"

const orderStatus = sequelize.define("order_status", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT({
            length: "medium"
        }),
        allowNull: false
    }
})

orderStatus.hasMany(orderDetails, {
    foreignKey: "order_status_id"
})

orderDetails.belongsTo(orderStatus, {
    foreignKey: "order_status_id"
})

export default orderStatus