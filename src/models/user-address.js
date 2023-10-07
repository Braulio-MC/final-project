import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import user from "./user.js"
import address from "./address.js"

const userAddress = sequelize.define("user_address", {
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
})

user.belongsToMany(address, { through: userAddress })
address.belongsToMany(user, { through: userAddress })

export default userAddress