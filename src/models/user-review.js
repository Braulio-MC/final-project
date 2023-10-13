import { DataTypes } from "sequelize"
import sequelize from "../database/connection.js"
import users from "./user.js"
import orderLines from "./order-line.js"

const userReviews = sequelize.define("user_reviews", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT({
            length: "medium"
        }),
        allowNull: false
    },
    pending: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
    // user_id
    // order_line_id
})

users.hasMany(userReviews, {
    foreignKey: "user_id"
})

userReviews.belongsTo(users, {
    foreignKey: "user_id"
})

orderLines.hasOne(userReviews, {
    foreignKey: "order_line_id"
})

userReviews.belongsTo(orderLines, {
    foreignKey: "order_line_id"
})

export default userReviews