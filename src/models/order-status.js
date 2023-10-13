import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"

const orderStatuses = sequelize.define("order_statuses", {
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

export default orderStatuses