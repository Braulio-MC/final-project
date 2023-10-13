import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import users from "./user.js"

const stores = sequelize.define("stores", {
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
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: {
                msg: "An URL format was expected"
            }
        }
    }
    // user_id
})

users.hasMany(stores, {
    foreignKey: "user_id"
})

stores.belongsTo(users, {
    foreignKey: "user_id"
})

export default stores