import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import shoppingSession from "./shopping-session.js"
import userPaymentMethod from "./user-payment-method.js"
import orderDetails from "./order-details.js"

const user = sequelize.define("user", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    }
})

user.hasOne(shoppingSession, {
    foreignKey: "user_id"
})

shoppingSession.belongsTo(user, {
    foreignKey: "user_id"
})

user.hasMany(orderDetails, {
    foreignKey: "user_id",
})

orderDetails.belongsTo(user, {
    foreignKey: "user_id",
})

user.hasMany(userPaymentMethod, {
    foreignKey: "user_id",
})

userPaymentMethod.belongsTo(user, {
    foreignKey: "user_id",
})

export default user