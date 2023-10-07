import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import shoppingCartItem from "./shopping-session-item.js"

const shoppingSession = sequelize.define("shopping_session", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Total must be greater or equal to 0"
            }
        }
    }
})

shoppingSession.hasMany(shoppingCartItem, {
    foreignKey: "shopping_session_id",
})

shoppingCartItem.belongsTo(shoppingSession, {
    foreignKey: "shopping_session_id",
})

export default shoppingSession