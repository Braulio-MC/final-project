import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import orderStatuses from "./order-status.js"
import users from "./user.js"
import userPaymentMethods from "./user-payment-method.js"
import deliveryLocations from "./delivery-location.js"
import stores from "./store.js"

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
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Total cannot be less than 0"
            }
        }
    }
    // order_status_id
    // user_id
    // user_payment_id
    // delivery_location_id
    // store_id
})

orderStatuses.hasMany(orderDetails, {
    foreignKey: "order_status_id"
})

orderDetails.belongsTo(orderStatuses, {
    foreignKey: "order_status_id"
})

users.hasMany(orderDetails, {
    foreignKey: "user_id"
})

orderDetails.belongsTo(users, {
    foreignKey: "user_id"
})

userPaymentMethods.hasMany(orderDetails, {
    foreignKey: "user_payment_menthod_id"
})

orderDetails.belongsTo(userPaymentMethods, {
    foreignKey: "user_payment_menthod_id"
})

deliveryLocations.hasMany(orderDetails, {
    foreignKey: "delivery_location_id"
})

orderDetails.belongsTo(deliveryLocations, {
    foreignKey: "delivery_location_id"
})

stores.hasMany(orderDetails, {
    foreignKey: "store_id"
})

orderDetails.belongsTo(stores, {
    foreignKey: "store_id"
})

export default orderDetails