import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import stores from "./store.js"

const deliveryLocations = sequelize.define("delivery_locations", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT({
            length: "medium"
        }),
        allowNull: false
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
    // store_id
})

stores.hasMany(deliveryLocations, {
    foreignKey: "store_id"
})

deliveryLocations.belongsTo(stores, {
    foreignKey: "store_id"
})

export default deliveryLocations