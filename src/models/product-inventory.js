import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import product from "./product.js"

const productInventory = sequelize.define("product_inventory", {
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
})

productInventory.hasOne(product, {
    foreignKey: "inventory_id"
})

product.belongsTo(productInventory, {
    foreignKey: "inventory_id"
})

export default productInventory