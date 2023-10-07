import app from "./app.js"
import sequelize from "./database/connection.js"

import "./models/address.js"
import "./models/country.js"
import "./models/order-details.js"
import "./models/order-line.js"
import "./models/order-status.js"
import "./models/payment-type.js"
import "./models/product-category.js"
import "./models/product-variation-option.js"
import "./models/product-inventory.js"
import "./models/product.js"
import "./models/promotion-category.js"
import "./models/promotion.js"
import "./models/shopping-session-item.js"
import "./models/shopping-session.js"
import "./models/user-address.js"
import "./models/user-payment-method.js"
import "./models/user.js"
import "./models/variation-option.js"
import "./models/variation.js"

async function main() {
    try {
        //await sequelize.sync({ force: true })
        app.listen(process.env.DEVEL_PORT)
    } catch (error) {
        console.error(`${error}`)  // development purposes
    }
}

main()