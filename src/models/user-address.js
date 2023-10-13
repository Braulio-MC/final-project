import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import users from "./user.js"
import addresses from "./address.js"

const userAddresses = sequelize.define("user_addresses", {
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
})

users.belongsToMany(addresses, { 
    through: userAddresses,
    foreignKey: "user_id"
})

addresses.belongsToMany(users, { 
    through: userAddresses,
    foreignKey: "address_id"
})

export default userAddresses