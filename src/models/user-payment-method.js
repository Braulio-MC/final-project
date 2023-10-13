import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import paymentTypes from "./payment-type.js"
import users from "./user.js"

const userPaymentMethods = sequelize.define("user_payment_methods", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
    // payment_type_id
    // user_id
})

paymentTypes.hasMany(userPaymentMethods, {
    foreignKey: "payment_type_id"
})

userPaymentMethods.belongsTo(paymentTypes, {
    foreignKey: "payment_type_id"
})

users.hasMany(userPaymentMethods, {
    foreignKey: "user_id"
})

userPaymentMethods.belongsTo(users, {
    foreignKey: "user_id"
})

export default userPaymentMethods