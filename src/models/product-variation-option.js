import sequelize from "../database/connection.js"
import product from "./product.js"
import variationOption from "./variation-option.js"

const productVariationOptions = sequelize.define("product_variation_options", {

})

product.belongsToMany(variationOption, { through: productVariationOptions })
variationOption.belongsToMany(product, { through: productVariationOptions })

export default productVariationOptions