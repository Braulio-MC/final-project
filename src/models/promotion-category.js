import sequelize from "../database/connection.js"
import promotion from "./promotion.js"
import productCategory from "./product-category.js"

// Deprecated

const promotionCategory = sequelize.define("promotion_category", {

})

promotion.belongsToMany(productCategory, { through: promotionCategory })
productCategory.belongsToMany(promotion, { through: promotionCategory })

export default promotionCategory