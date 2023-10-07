import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import userPaymentMethod from "./user-payment-method.js"

const paymentType = sequelize.define("payment_type", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
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

paymentType.hasMany(userPaymentMethod, {
    foreignKey: "payment_type_id",
})

userPaymentMethod.belongsTo(paymentType, {
    foreignKey: "payment_type_id"
})

export default paymentType