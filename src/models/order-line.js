import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"

const orderLine = sequelize.define("order_line", {
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
                msg: "Minimun quantity must be equal to 0"
            }
        }
    },
    total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Price cannot be less than 0"
            }
        }
    }
})

// orderLine.findAll({
//     include: {
//         model: "",
//         as: "Reviews",
//         where: {
//             product_id: ""
//         }
//     }
// })

export default orderLine