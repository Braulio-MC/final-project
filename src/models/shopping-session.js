import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import users from "./user.js"

const shoppingSessions = sequelize.define("shopping_sessions", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Total must be greater than 0"
            }
        }
    }
    // user_id
})

users.hasOne(shoppingSessions, {
    foreignKey: "user_id"
})

shoppingSessions.belongsTo(users, {
    foreignKey: "user_id"
})

export default shoppingSessions