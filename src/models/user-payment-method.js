import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"

const userPaymentMethod = sequelize.define("user_payment_method", {
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
})

export default userPaymentMethod