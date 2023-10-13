import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import stores from "./store.js"

const productInventories = sequelize.define("product_inventories", {
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
                msg: "Minimum stock must be equal to 0"
            }
        }
    }
    // store_id
})

stores.hasMany(productInventories, {
    foreignKey: "store_id"
})

productInventories.belongsTo(stores, {
    foreignKey: "store_id"
})

export default productInventories