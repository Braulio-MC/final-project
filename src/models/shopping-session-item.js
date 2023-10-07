import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"

const shoppingSessionItem = sequelize.define("shopping_session_item", {
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
                msg: "Quantity must be greater than 0"
            }
        }
    }
})

export default shoppingSessionItem