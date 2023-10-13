import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import stores from "./store.js"

const promotions = sequelize.define("promotions", {
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
    discount_rate: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Discount rate must be greater or equal to 0"
            },
            max: {
                args: [100],
                msg: "Discount rate must be less than 100"
            }
        }
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {  // validate greater than start date
        type: DataTypes.DATE,
        allowNull: false
    }
    // store_id
})

stores.hasMany(promotions, {
    foreignKey: "store_id"
})

promotions.belongsTo(stores, {
    foreignKey: "store_id"
})

export default promotions