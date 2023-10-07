import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"

const address = sequelize.define("address", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    unit_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    street_desc: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address_line1: {
        type: DataTypes.STRING,
    },
    address_line2: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postal_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

export default address