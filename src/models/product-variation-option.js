import sequelize from "../database/connection.js"
import products from "./product.js"
import variationOptions from "./variation-option.js"

const productVariationOptions = sequelize.define("product_variation_options", {

})

products.belongsToMany(variationOptions, { 
    through: productVariationOptions,
    foreignKey: "product_id"
})
variationOptions.belongsToMany(products, { 
    through: productVariationOptions,
    foreignKey: "variation_option_id"
})

export default productVariationOptions