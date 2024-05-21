import { body, param, query } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import FilterOperators from '../core/criteria/FilterOperators'
import OrderTypes from '../core/criteria/OrderTypes'
import ErrorResponse from '../core/ErrorResponse'

export const usersValidation = {
  addPermissionsToUser: [
    body('permissions', "Array with name 'permissions' and min length of one expected").isArray({ min: 1 }),
    body('permissions.*', 'Invalid empty value').notEmpty(),
    body('permissions.*', 'String field expected').isString(),
    body('permissions.*', 'String does not match permission format').matches('[a-z]:[a-z]')
  ],
  deleteUserPermissions: [
    body('permissions', "Array with name 'permissions' and min length of one expected").isArray({ min: 1 }),
    body('permissions.*', 'Invalid empty value').notEmpty(),
    body('permissions.*', 'String field expected').isString(),
    body('permissions.*', 'String does not match permission format').matches('[a-z]:[a-z]')
  ],
  createUserFavoriteStore: [
    param('id', 'User ID expected').notEmpty(),
    param('id', 'User ID must be string').isString(),
    body('store_id', 'Store ID expected').notEmpty(),
    body('store_id', 'Store ID must be string').isString(),
    body('name', 'Store name expected').notEmpty(),
    body('name', 'Store name must be string').isString(),
    body('image', 'Store image expected').notEmpty(),
    body('image', 'Store image must be URL').isURL(),
    body('description', 'Store description expected').notEmpty(),
    body('description', 'Store description must be string').isString(),
    body('email', 'Store email expected').notEmpty(),
    body('email', 'Store email must be email').isEmail(),
    body('phone_number', 'Store phone number expected').notEmpty(),
    body('phone_number', 'Store phone number must be mobile phone').isMobilePhone('es-MX')
  ],
  deleteUserFavoriteStore: [
    param('id', 'User ID expected').notEmpty(),
    param('id', 'User ID must be string').isString(),
    param('storeId', 'Store ID expected').notEmpty(),
    param('storeId', 'Store ID must be string').isString()
  ],
  createUserFavoriteProduct: [
    param('id', 'User ID expected').notEmpty(),
    param('id', 'User ID must be string').isString(),
    body('product_id', 'Product ID expected').notEmpty(),
    body('product_id', 'Product ID must be string').isString(),
    body('name', 'Product name expected').notEmpty(),
    body('name', 'Product name must be string').isString(),
    body('image', 'Product image expected').notEmpty(),
    body('image', 'Product image must be URL').isURL(),
    body('description', 'Product description expected').notEmpty(),
    body('description', 'Product description must be string').isString()
  ],
  deleteUserFavoriteProduct: [
    param('id', 'User ID expected').notEmpty(),
    param('id', 'User ID must be string').isString(),
    param('productId', 'Product ID expected').notEmpty(),
    param('productId', 'Product ID must be string').isString()
  ]
}

export const paymentsValidation = {
  checkout: [
    body('items', "Array with name 'items' and min length of one expected").isArray({ min: 1 }),
    body('items.*', 'Invalid empty value').notEmpty(),
    body('items.*', 'UUIDv4 field expected').isUUID('4')
  ],
  createType: [
    body('name', 'Name expected').notEmpty(),
    body('name', 'Name must be string').isString(),
    body('description', 'Description expected').notEmpty(),
    body('description', 'Description must be string').isString()
  ],
  updateType: [
    body('name', 'Name expected').notEmpty(),
    body('name', 'Name must be string').isString(),
    body('description', 'Description expected').notEmpty(),
    body('description', 'Description must be string').isString()
  ]
}

export const storesValidation = {
  createStore: [
    body('name', 'Name expected').notEmpty(),
    body('name', 'Name must be string').isString(),
    body('description', 'Description expected').notEmpty(),
    body('description', 'Description must be string').isString(),
    body('email', 'Email expected').notEmpty(),
    body('email', 'Email must be email').isEmail(),
    body('phoneNumber', 'Phone number expected').notEmpty(),
    body('phoneNumber', 'Phone number must be mobile phone').isMobilePhone('es-MX'),
    body('image', 'Image expected').notEmpty(),
    body('image', 'Image must be URL format').isURL(),
    body('userId', 'User ID expected').notEmpty(),
    body('userId', 'User ID must be string').isString()
  ],
  updateStore: [
    body('name', 'Name expected').notEmpty(),
    body('name', 'Name must be string').isString(),
    body('description', 'Description expected').notEmpty(),
    body('description', 'Description must be string').isString(),
    body('email', 'Email expected').notEmpty(),
    body('email', 'Email must be email').isEmail(),
    body('phoneNumber', 'Phone number expected').notEmpty(),
    body('phoneNumber', 'Phone number must be mobile phone').isMobilePhone('es-MX'),
    body('image', 'Image expected').notEmpty(),
    body('image', 'Image must be URL format').isURL(),
    body('userId', 'User ID expected').notEmpty(),
    body('userId', 'User ID must be string').isString()
  ]
}

export const categoriesValidation = {
  createCategory: [
    body('name')
      .notEmpty().withMessage('Category name expected')
      .isString().withMessage('Category name must be string'),
    body('parentId')
      .exists().withMessage('Parent ID must exist')
      .isString().withMessage('Parent ID must be string')
      .default(''),
    body('parentName')
      .exists().withMessage('Parent name must exist')
      .isString().withMessage('Parent name must be string')
      .default(''),
    body('storeId')
      .exists().withMessage('Store ID must exist')
      .isString().withMessage('Store ID must be string')
      .default('')
  ],
  updateCategory: [
    body('name')
      .notEmpty().withMessage('Category name expected')
      .isString().withMessage('Category name must be string'),
    body('parentId')
      .exists().withMessage('Parent ID must exist')
      .isString().withMessage('Parent ID must be string')
      .default(''),
    body('parentName')
      .exists().withMessage('Parent name must exist')
      .isString().withMessage('Parent name must be string')
      .default(''),
    body('storeId')
      .exists().withMessage('Store ID must exist')
      .isString().withMessage('Store ID must be string')
      .default('')
  ]
}

export const discountsValidation = {
  createDiscount: [
    body('percentage', 'Percentage expected').notEmpty(),
    body('percentage', 'Percentage must be numeric').isNumeric(),
    body('startDate', 'Start date expected').notEmpty(),
    body('startDate', 'Start date must be date').toDate().custom((startDate, { req }) => {
      if (startDate.getTime() > req.body.endDate.getTime()) {
        throw new ErrorResponse('Start date must be before end date', StatusCodes.BAD_REQUEST)
      }
      return true
    }),
    body('endDate', 'End date expected').notEmpty(),
    body('endDate', 'End date must be date').toDate().custom((endDate, { req }) => {
      if (endDate.getTime() < req.body.startDate.getTime()) {
        throw new ErrorResponse('End date must be after start date', StatusCodes.BAD_REQUEST)
      }
      return true
    }),
    body('storeId', 'Store ID expected').notEmpty(),
    body('storeId', 'Store ID must be string').isString()
  ],
  updateDiscount: [
    body('percentage', 'Percentage expected').notEmpty(),
    body('percentage', 'Percentage must be numeric').isNumeric(),
    body('startDate', 'Start date expected').notEmpty(),
    body('startDate', 'Start date must be date').toDate().custom((startDate, { req }) => {
      if (startDate.getTime() > req.body.endDate.getTime()) {
        throw new ErrorResponse('Start date must be before end date', StatusCodes.BAD_REQUEST)
      }
      return true
    }),
    body('endDate', 'End date expected').notEmpty(),
    body('endDate', 'End date must be date').toDate().custom((endDate, { req }) => {
      if (endDate.getTime() < req.body.startDate.getTime()) {
        throw new ErrorResponse('End date must be after start date', StatusCodes.BAD_REQUEST)
      }
      return true
    }),
    body('storeId', 'Store ID expected').notEmpty(),
    body('storeId', 'Store ID must be string').isString()
  ]
}

export const productsValidation = {
  createProduct: [
    body('name', 'Name expected').notEmpty(),
    body('name', 'Name must be string').isString(),
    body('description', 'Description expected').notEmpty(),
    body('description', 'Description must be string').isString(),
    body('image', 'Image expected').notEmpty(),
    body('image', 'Image must be URL format').isURL(),
    body('price', 'Price expected').notEmpty(),
    body('price', 'Price must be float').isFloat(),
    body('quantity', 'Quantity expected').notEmpty(),
    body('quantity', 'Quantity must be numeric').isInt(),
    body('categoryId', 'Category ID expected').notEmpty(),
    body('categoryId', 'Category ID must be string').isString(),
    body('categoryName', 'Category name expected').notEmpty(),
    body('categoryName', 'Category name must be string').isString(),
    body('categoryParentName', 'Category parent name expected').exists(),
    body('categoryParentName', 'Category parent name must be string').isString(),
    body('storeId', 'Store ID expected').notEmpty(),
    body('storeId', 'Store ID must be string').isString(),
    body('storeName', 'Store name expected').notEmpty(),
    body('storeName', 'Store name must be string').isString(),
    body('discountId', 'Discount ID expected').exists(),
    body('discountId', 'Discount ID must be string').isString(),
    body('discountPercentage', 'Discount percentage expected').exists(),
    body('discountPercentage', 'Discount percentage must be numeric').default(0).isNumeric(),
    body('discountStartDate', 'Discount start date expected').exists(),
    body('discountStartDate', 'Discount start date must be date').toDate().custom((date, { req }) => {
      if (!(date instanceof Date)) {
        req.body.discountStartDate = new Date(1970, 0)
      }
      return true
    }),
    body('discountEndDate', 'Discount end date expected').exists(),
    body('discountEndDate', 'Discount end date must be date').toDate().custom((date, { req }) => {
      if (!(date instanceof Date)) {
        req.body.discountEndDate = new Date(1970, 0)
      }
      return true
    })
  ],
  updateProduct: [
    body('name', 'Name expected').notEmpty(),
    body('name', 'Name must be string').isString(),
    body('description', 'Description expected').notEmpty(),
    body('description', 'Description must be string').isString(),
    body('image', 'Image expected').notEmpty(),
    body('image', 'Image must be URL format').isURL(),
    body('price', 'Price expected').notEmpty(),
    body('price', 'Price must be float').isFloat(),
    body('quantity', 'Quantity expected').notEmpty(),
    body('quantity', 'Quantity must be numeric').isInt(),
    body('categoryId', 'Category ID expected').notEmpty(),
    body('categoryId', 'Category ID must be string').isString(),
    body('categoryName', 'Category name expected').notEmpty(),
    body('categoryName', 'Category name must be string').isString(),
    body('categoryParentName', 'Category parent name expected').exists(),
    body('categoryParentName', 'Category parent name must be string').isString(),
    body('storeId', 'Store ID expected').notEmpty(),
    body('storeId', 'Store ID must be string').isString(),
    body('storeName', 'Store name expected').notEmpty(),
    body('storeName', 'Store name must be string').isString(),
    body('discountId', 'Discount ID expected').exists(),
    body('discountId', 'Discount ID must be string').isString(),
    body('discountPercentage', 'Discount percentage expected').exists(),
    body('discountPercentage', 'Discount percentage must be numeric').default(0).isNumeric(),
    body('discountStartDate', 'Discount start date expected').exists(),
    body('discountStartDate', 'Discount start date must be date').toDate().custom((date, { req }) => {
      if (!(date instanceof Date)) {
        req.body.discountStartDate = new Date(1970, 0)
      }
      return true
    }),
    body('discountEndDate', 'Discount end date expected').exists(),
    body('discountEndDate', 'Discount end date must be date').toDate().custom((date, { req }) => {
      if (!(date instanceof Date)) {
        req.body.discountEndDate = new Date(1970, 0)
      }
      return true
    })
  ]
}

export const deliveryLocationsValidation = {
  createLocation: [
    body('name', 'Name expected').notEmpty(),
    body('name', 'Name must be string').isString(),
    body('description', 'Description expected').notEmpty(),
    body('description', 'Description must be string').isString(),
    body('storeId', 'Store ID expected').notEmpty(),
    body('storeId', 'Store ID must be string').isString()
  ],
  updateLocation: [
    body('name', 'Name expected').notEmpty(),
    body('name', 'Name must be string').isString(),
    body('description', 'Description expected').notEmpty(),
    body('description', 'Description must be string').isString(),
    body('storeId', 'Store ID expected').notEmpty(),
    body('storeId', 'Store ID must be string').isString()
  ]
}

export const ordersValidation = {
  createOrder: [
    body('total', 'Order total expected').notEmpty(),
    body('total', 'Order total must be float').isFloat(),
    body('status', 'Status expected').notEmpty(),
    body('status', 'Status must be string').isString(),
    body('userId', 'User ID expected').notEmpty(),
    body('userId', 'User ID must be string').isString(),
    body('userName', 'User name expected').notEmpty(),
    body('userName', 'User name must be string').isString(),
    body('locationId', 'Delivery location ID expected').notEmpty(),
    body('locationId', 'Delivery location ID must be string').isString(),
    body('locationName', 'Delivery location name expected').notEmpty(),
    body('locationName', 'Delivery location name must be string').isString(),
    body('storeId', 'Store ID expected').notEmpty(),
    body('storeId', 'Store ID must be string').isString(),
    body('storeName', 'Store name expected').notEmpty(),
    body('storeName', 'Store name must be string').isString(),
    body('paymentId', 'Payment ID expected').notEmpty(),
    body('paymentId', 'Payment ID must be string').isString(),
    body('paymentName', 'Payment name expected').notEmpty(),
    body('paymentName', 'Payment name must be string').isString(),
    body('orderLines', 'Order lines must be array and contain one item at least').isArray({ min: 1 }),
    body('orderLines.*.total', 'Order line total expected').notEmpty(),
    body('orderLines.*.total', 'Order line total must be float').isFloat(),
    body('orderLines.*.quantity', 'Order line quantity expected').notEmpty(),
    body('orderLines.*.quantity', 'Order line quantity must be int').isInt(),
    body('orderLines.*.product', 'Order line product expected').notEmpty(),
    body('orderLines.*.product', 'Order line product must be object').isObject(),
    body('orderLines.*.product.id', 'Order line product ID expected').notEmpty(),
    body('orderLines.*.product.id', 'Order line product ID must be string').isString(),
    body('orderLines.*.product.name', 'Order line product name expected').notEmpty(),
    body('orderLines.*.product.name', 'Order line product name must be string').isString(),
    body('orderLines.*.product.image', 'Order line product image expected').notEmpty(),
    body('orderLines.*.product.image', 'Order line product image must be URL').isURL(),
    body('orderLines.*.product.price', 'Order line product price expected').notEmpty(),
    body('orderLines.*.product.price', 'Order line product price must be float').isFloat()
  ],
  updateOrder: [
    body('status', 'Status expected').notEmpty(),
    body('status', 'Status must be string').isString()
  ]
}

export const cartsValidation = {
  createCart: [
    body('userId', 'User ID expected').notEmpty(),
    body('userId', 'User ID must be string').isString(),
    body('storeId', 'Store ID expected').notEmpty(),
    body('storeId', 'Store ID must be string').isString(),
    body('storeName', 'Store name expected').notEmpty(),
    body('storeName', 'Store name must be string').isString(),
    body('products', 'Product list expected').isArray({ min: 1 }),
    body('products.*.id', 'Product ID expected').notEmpty(),
    body('products.*.id', 'Product ID must be string').isString(),
    body('products.*.name', 'Product name expected').notEmpty(),
    body('products.*.name', 'Product name must be string').isString(),
    body('products.*.image', 'Product image expected').notEmpty(),
    body('products.*.image', 'Product image must be URL').isURL(),
    body('products.*.price', 'Product price expected').notEmpty(),
    body('products.*.price', 'Product price must be float').isFloat(),
    body('products.*.quantity', 'Product quantity expected').notEmpty(),
    body('products.*.quantity', 'Product quantity must be integer').isInt()
  ],
  updateCart: [
    param('id', 'Cart ID expected as parameter').notEmpty(),
    param('id', 'Cart ID must be string').isString(),
    body('storeId', 'Store ID expected').notEmpty(),
    body('storeId', 'Store ID must be string').isString(),
    body('storeName', 'Store name expected').notEmpty(),
    body('storeName', 'Store name must be string').isString(),
    body('products', 'Product list expected').isArray({ min: 1 }),
    body('products.*.id', 'Product ID expected').notEmpty(),
    body('products.*.id', 'Product ID must be string').isString(),
    body('products.*.name', 'Product name expected').notEmpty(),
    body('products.*.name', 'Product name must be string').isString(),
    body('products.*.image', 'Product image expected').notEmpty(),
    body('products.*.image', 'Product image must be URL').isURL(),
    body('products.*.price', 'Product price expected').notEmpty(),
    body('products.*.price', 'Product price must be float').isFloat(),
    body('products.*.quantity', 'Product quantity expected').notEmpty(),
    body('products.*.quantity', 'Product quantity must be integer').isInt()
  ]
}

export const productReviewsValidation = {
  createProductReview: [
    body('userId', 'User ID expected').notEmpty(),
    body('userId', 'User ID must be string').isString(),
    body('productId', 'Product ID expected').notEmpty(),
    body('productId', 'Product ID must be string').isString(),
    body('rating', 'Rating expected').exists(),
    body('rating', 'Rating must be integer').isInt()
  ],
  updateProductReview: [
    body('rating')
      .exists().withMessage('Rating expected')
      .isInt().withMessage('Rating must be integer')
      .toInt()
  ]
}

export const productFavoritesValidation = {
  createProductFavorite: [
    body('userId', 'User ID expected').notEmpty(),
    body('userId', 'User ID must be string').isString(),
    body('productId', 'Product ID expected').notEmpty(),
    body('productId', 'Product ID must be string').isString(),
    body('productName', 'Product name expected').notEmpty(),
    body('productName', 'Product name must be string').isString(),
    body('productImage', 'Product image expected').notEmpty(),
    body('productImage', 'Product image must be URL').isURL(),
    body('productDescription', 'Product description expected').notEmpty(),
    body('productDescription', 'Product description must be string').isString()
  ],
  updateProductFavorite: [
    body('userId', 'User ID expected').notEmpty(),
    body('userId', 'User ID must be string').isString(),
    body('productId', 'Product ID expected').notEmpty(),
    body('productId', 'Product ID must be string').isString(),
    body('productName', 'Product name expected').notEmpty(),
    body('productName', 'Product name must be string').isString(),
    body('productImage', 'Product image expected').notEmpty(),
    body('productImage', 'Product image must be URL').isURL(),
    body('productDescription', 'Product description expected').notEmpty(),
    body('productDescription', 'Product description must be string').isString()
  ]
}

export const storeReviewsValidation = {
  createStoreReview: [
    body('userId')
      .notEmpty().withMessage('User ID expected')
      .isString().withMessage('User ID must be string'),
    body('storeId')
      .notEmpty().withMessage('Store ID expected')
      .isString().withMessage('Store ID must be string'),
    body('rating')
      .exists().withMessage('Rating expected')
      .isInt().withMessage('Rating must be integer')
      .toInt()
  ],
  updateStoreReview: [
    body('rating')
      .exists().withMessage('Rating expected')
      .isInt().withMessage('Rating must be integer')
      .toInt()
  ]
}

export const storeFavoritesValidation = {
  createStoreFavorite: [
    body('userId')
      .notEmpty().withMessage('User ID expected')
      .isString().withMessage('User ID must be string'),
    body('storeId')
      .notEmpty().withMessage('Store ID expected')
      .isString().withMessage('Store ID must be string'),
    body('name')
      .notEmpty().withMessage('Name expected')
      .isString().withMessage('Name must be string'),
    body('image')
      .exists().withMessage('image expected')
      .isURL().withMessage('Image must be URL format'),
    body('description')
      .notEmpty().withMessage('Description expected')
      .isString().withMessage('Description must be string'),
    body('email')
      .notEmpty().withMessage('Email expected')
      .isEmail().withMessage('Email must be email format'),
    body('phoneNumber')
      .notEmpty().withMessage('Phone number expected')
      .isMobilePhone('es-MX').withMessage('Phone number must be mobile phone')
  ],
  updateStoreFavorite: [
    body('userId')
      .notEmpty().withMessage('User ID expected')
      .isString().withMessage('User ID must be string'),
    body('storeId')
      .notEmpty().withMessage('Store ID expected')
      .isString().withMessage('Store ID must be string'),
    body('name')
      .notEmpty().withMessage('Name expected')
      .isString().withMessage('Name must be string'),
    body('image')
      .exists().withMessage('image expected')
      .isURL().withMessage('Image must be URL format'),
    body('description')
      .notEmpty().withMessage('Description expected')
      .isString().withMessage('Description must be string'),
    body('email')
      .notEmpty().withMessage('Email expected')
      .isEmail().withMessage('Email must be email format'),
    body('phoneNumber')
      .notEmpty().withMessage('Phone number expected')
      .isMobilePhone('es-MX').withMessage('Phone number must be mobile phone')
  ]
}

export const pagingValidation = [
  query('limit')
    .optional()
    .isInt().withMessage('Limit must be integer')
    .toInt(),
  query('after')
    .optional()
    .isUUID(4).withMessage('After must be a valid UUIDv4'),
  query('before')
    .optional()
    .isUUID(4).withMessage('After must be a valid UUIDv4')
]

export const searchValidation = [
  query('query')
    .optional()
    .isString().withMessage('Query must be string'),
  query('perPage')
    .optional()
    .isInt().withMessage('PerPage must be integer')
    .toInt()
]

export const criteriaValidation = [
  body('filters')
    .isArray({ min: 1 }).withMessage('Filter list must contain at least one filter'),
  body('filters.*.field')
    .exists().withMessage('Field expected')
    .custom(field => {
      if (Array.isArray(field) && field.length > 0) {
        let notString = false
        field.forEach(item => {
          if (typeof item !== 'string') {
            notString = true
          }
        })
        if (notString) {
          throw new ErrorResponse('Array fields must be string type', StatusCodes.BAD_REQUEST)
        }
      } else {
        throw new ErrorResponse('String array with minimum length of 1 expected', StatusCodes.BAD_REQUEST)
      }
      return true
    }),
  body('filters.*.operator')
    .notEmpty().withMessage('Operator expected')
    .isString().withMessage('Operator must be string')
    .isIn(Object.values(FilterOperators)).withMessage(`Operator must be in: ${Object.values(FilterOperators).join(', ')}`),
  body('filters.*.value')
    .exists().withMessage('Value expected'),
  body('order')
    .isObject().withMessage('Order object expected'),
  body('order.orderBy')
    .exists().withMessage('Order.orderBy must exist')
    .isString().withMessage('Order.orderBy must be string')
    .default(''),
  body('order.orderType')
    .notEmpty().withMessage('Order.orderType expected')
    .isString().withMessage('Order.orderType must be string')
    .isIn(Object.values(OrderTypes)).withMessage(`Order type must be in: ${Object.values(OrderTypes).join(', ')}`),
  ...pagingValidation
]
