import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"

const promotion = sequelize.define("promotion", {
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
                msg: "Discount rate must be greater than 0"
            },
            max: {
                args: [100],
                msg: "Discount rate must be less than 100"
            }
        }
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {  // validate greater than start date
        type: DataTypes.DATE,
        allowNull: false
    },
})

export default promotion