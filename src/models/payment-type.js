import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"

const paymentTypes = sequelize.define("payment_types", {
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

export default paymentTypes