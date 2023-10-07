import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import address from "./address.js"

const country = sequelize.define("country", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    country_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

country.hasMany(address, {
    foreignKey: "country_id",
})

address.belongsTo(country, {
    foreignKey: "country_id",
})

export default country