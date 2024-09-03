import { body, query } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import FilterOperators from '../core/criteria/FilterOperators'
import OrderTypes from '../core/criteria/OrderTypes'
import ErrorResponse from '../core/ErrorResponse'
import { firestoreConfig } from '../core/Configuration'
import OrderStatuses from '../core/OrderStatuses'
import GetStreamMessagingChannelTypes from '../core/GetStreamMessagingChannelTypes'
import GetStreamMessagingUserRoleTypes from '../core/GetStreamMessagingUserRoleTypes'

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
    body('name')
      .notEmpty().withMessage('Name expected')
      .isString().withMessage('Name must be string'),
    body('description')
      .notEmpty().withMessage('Description expected')
      .isString().withMessage('Description must be string'),
    body('email')
      .notEmpty().withMessage('Email expected')
      .isEmail().withMessage('Email must be email'),
    body('phoneNumber')
      .notEmpty().withMessage('Phone number expected')
      .isMobilePhone('es-MX').withMessage('Phone number must be mobile phone'),
    body('userId')
      .notEmpty().withMessage('User ID expected')
      .isString().withMessage('User ID must be string')
  ],
  updateStore: [
    body('name')
      .notEmpty().withMessage('Name expected')
      .isString().withMessage('Name must be string'),
    body('description')
      .notEmpty().withMessage('Description expected')
      .isString().withMessage('Description must be string'),
    body('email')
      .notEmpty().withMessage('Email expected')
      .isEmail().withMessage('Email must be email'),
    body('phoneNumber')
      .notEmpty().withMessage('Phone number expected')
      .isMobilePhone('es-MX').withMessage('Phone number must be mobile phone'),
    body('userId')
      .notEmpty().withMessage('User ID expected')
      .isString().withMessage('User ID must be string')
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
    body('percentage')
      .isNumeric().withMessage('Percentage must be numeric'),
    body('startDate')
      .isNumeric().withMessage('Start date must be timestamp'),
    body('endDate')
      .isNumeric().withMessage('End date must be timestamp')
      .custom((endDate, { req }) => {
        const start = new Date(req.body.startDate)
        const end = new Date(endDate)
        if (start > end) {
          throw new ErrorResponse('End date must be after start date', StatusCodes.BAD_REQUEST)
        }
        return true
      }),
    body('storeId')
      .exists().withMessage('Store ID should exist')
      .isString().withMessage('Store ID must be string')
  ],
  updateDiscount: [
    body('percentage')
      .isNumeric().withMessage('Percentage must be numeric'),
    body('startDate')
      .isNumeric().withMessage('Start date must be timestamp'),
    body('endDate')
      .isNumeric().withMessage('End date must be timestamp')
      .custom((endDate, { req }) => {
        const start = new Date(req.body.startDate)
        const end = new Date(endDate)
        if (start > end) {
          throw new ErrorResponse('End date must be after start date', StatusCodes.BAD_REQUEST)
        }
        return true
      }),
    body('storeId')
      .exists().withMessage('Store ID should exist')
      .isString().withMessage('Store ID must be string')
  ]
}

export const productsValidation = {
  createProduct: [
    body('name')
      .notEmpty().withMessage('Name expected')
      .isString().withMessage('Name must be string'),
    body('description')
      .notEmpty().withMessage('Description expected')
      .isString().withMessage('Description must be string'),
    body('price')
      .isFloat().withMessage('Price must be float')
      .toFloat(),
    body('quantity')
      .isInt().withMessage('Quantity must be integer')
      .toInt(),
    body('categoryId')
      .notEmpty().withMessage('Category ID expected')
      .isString().withMessage('Category ID must be string'),
    body('categoryName')
      .notEmpty().withMessage('Category name expected')
      .isString().withMessage('Category name must be string'),
    body('categoryParentName')
      .exists().withMessage('Category parent name must exist')
      .default('')
      .isString().withMessage('Category parent name must be string'),
    body('storeId')
      .notEmpty().withMessage('Store ID expected')
      .isString().withMessage('Store ID must be string'),
    body('storeName')
      .notEmpty().withMessage('Store name expected')
      .isString().withMessage('Store name must be string'),
    body('discountId')
      .exists().withMessage('Discount ID must exist')
      .default(firestoreConfig.discountDefaultId)
      .isString().withMessage('Discount ID must be string'),
    body('discountPercentage')
      .exists().withMessage('Discount percentage must exist')
      .default(Number.parseInt(firestoreConfig.discountDefaultPercentage as string))
      .isNumeric().withMessage('Discount percentage must be numeric'),
    body('discountStartDate')
      .exists().withMessage('Discount start date must exist')
      .default(firestoreConfig.discountDefaultDate).toDate(),
    body('discountEndDate')
      .exists().withMessage('Discount end date must exist')
      .default(firestoreConfig.discountDefaultDate)
      .toDate()
      .custom((discountEndDate, { req }) => {
        if (discountEndDate.getTime() > req.body.discountStartDate.getTime()) {
          throw new ErrorResponse('End date must be after start date', StatusCodes.BAD_REQUEST)
        }
        return true
      })
  ],
  updateProduct: [
    body('name')
      .notEmpty().withMessage('Name expected')
      .isString().withMessage('Name must be string'),
    body('description')
      .notEmpty().withMessage('Description expected')
      .isString().withMessage('Description must be string'),
    body('price')
      .isFloat().withMessage('Price must be float')
      .toFloat(),
    body('quantity')
      .isInt().withMessage('Quantity must be integer')
      .toInt(),
    body('categoryId')
      .notEmpty().withMessage('Category ID expected')
      .isString().withMessage('Category ID must be string'),
    body('categoryName')
      .notEmpty().withMessage('Category name expected')
      .isString().withMessage('Category name must be string'),
    body('categoryParentName')
      .exists().withMessage('Category parent name must exist')
      .default('')
      .isString().withMessage('Category parent name must be string'),
    body('storeId')
      .notEmpty().withMessage('Store ID expected')
      .isString().withMessage('Store ID must be string'),
    body('storeName')
      .notEmpty().withMessage('Store name expected')
      .isString().withMessage('Store name must be string'),
    body('discountId')
      .exists().withMessage('Discount ID must exist')
      .default(firestoreConfig.discountDefaultId)
      .isString().withMessage('Discount ID must be string'),
    body('discountPercentage')
      .exists().withMessage('Discount percentage must exist')
      .default(Number.parseInt(firestoreConfig.discountDefaultPercentage as string))
      .isNumeric().withMessage('Discount percentage must be numeric'),
    body('discountStartDate')
      .exists().withMessage('Discount start date must exist')
      .default(firestoreConfig.discountDefaultDate).toDate(),
    body('discountEndDate')
      .exists().withMessage('Discount end date must exist')
      .default(firestoreConfig.discountDefaultDate)
      .toDate()
      .custom((discountEndDate, { req }) => {
        if (discountEndDate.getTime() > req.body.discountStartDate.getTime()) {
          throw new ErrorResponse('End date must be after start date', StatusCodes.BAD_REQUEST)
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
    body('total')
      .isFloat().withMessage('Total must be float'),
    body('status')
      .notEmpty().withMessage('Status expected')
      .isString().withMessage('Status must be string')
      .isIn(Object.values(OrderStatuses)).withMessage(`Status must be in: ${Object.values(OrderStatuses).join(', ')}`),
    body('userId')
      .notEmpty().withMessage('User ID expected')
      .isString().withMessage('User ID must be string'),
    body('userName')
      .notEmpty().withMessage('User name expected')
      .isString().withMessage('User name must be string'),
    body('locationId')
      .notEmpty().withMessage('Delivery location ID expected')
      .isString().withMessage('Delivery location ID must be string'),
    body('locationName')
      .notEmpty().withMessage('Delivery location name expected')
      .isString().withMessage('Delivery location name must be string'),
    body('storeId')
      .notEmpty().withMessage('Store ID expected')
      .isString().withMessage('Store ID must be string'),
    body('storeName')
      .notEmpty().withMessage('Store name expected')
      .isString().withMessage('Store name must be string'),
    body('paymentId')
      .notEmpty().withMessage('Payment ID expected')
      .isString().withMessage('Payment ID must be string'),
    body('paymentName')
      .notEmpty().withMessage('Payment name expected')
      .isString().withMessage('Payment name must be string')
  ],
  updateOrder: [
    body('status')
      .notEmpty().withMessage('Status expected')
      .isString().withMessage('Status must be string')
      .isIn(Object.values(OrderStatuses)).withMessage(`Status must be in: ${Object.values(OrderStatuses).join(', ')}`)
  ]
}

export const orderlinesValidation = {
  createOrderline: [
    body('total')
      .isFloat().withMessage('Total must be float'),
    body('quantity')
      .isInt({ gt: 0 }).withMessage('Quantity must be integer and grater than 0'),
    body('productId')
      .notEmpty().withMessage('Product ID expected')
      .isString().withMessage('Product ID must be string'),
    body('productName')
      .notEmpty().withMessage('Product name expected')
      .isString().withMessage('Product name must be string'),
    body('productImage')
      .notEmpty().withMessage('Product image expected')
      .isURL().withMessage('Product image must be URL format'),
    body('productPrice')
      .isFloat().withMessage('Product price must be float')
  ],
  updateOrderline: [
    body('total')
      .isFloat().withMessage('Total must be float'),
    body('quantity')
      .isInt({ gt: 0 }).withMessage('Quantity must be integer and grater than 0'),
    body('productId')
      .notEmpty().withMessage('Product ID expected')
      .isString().withMessage('Product ID must be string'),
    body('productName')
      .notEmpty().withMessage('Product name expected')
      .isString().withMessage('Product name must be string'),
    body('productImage')
      .notEmpty().withMessage('Product image expected')
      .isURL().withMessage('Product image must be URL format'),
    body('productPrice')
      .isFloat().withMessage('Product price must be float')
  ]
}

export const cartsValidation = {
  createCart: [
    body('userId', 'User ID expected').notEmpty(),
    body('userId', 'User ID must be string').isString(),
    body('storeId', 'Store ID expected').notEmpty(),
    body('storeId', 'Store ID must be string').isString(),
    body('storeName', 'Store name expected').notEmpty(),
    body('storeName', 'Store name must be string').isString()
  ],
  updateCart: [
    body('storeId', 'Store ID expected').notEmpty(),
    body('storeId', 'Store ID must be string').isString(),
    body('storeName', 'Store name expected').notEmpty(),
    body('storeName', 'Store name must be string').isString()
  ]
}

export const shoppingCartItemsValidation = {
  createShoppingCartItem: [
    body('productId')
      .notEmpty().withMessage('Product ID expected')
      .isString().withMessage('Product ID must be string'),
    body('productName')
      .notEmpty().withMessage('Product name expected')
      .isString().withMessage('Product name must be string'),
    body('productImage')
      .notEmpty().withMessage('Product image expected')
      .isURL().withMessage('Product image must be URL format'),
    body('productPrice')
      .isFloat().withMessage('Product price must be float'),
    body('quantity')
      .isInt({ gt: 0 }).withMessage('Quantity must be integer and grater than 0')
  ],
  updateShoppingCartItem: [
    body('quantity')
      .isInt({ gt: 0 }).withMessage('Quantity must be integer and grater than 0')
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
  query('page')
    .optional()
    .isInt().withMessage('Page must be integer')
    .toInt(),
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

export const tokenValidation = {
  createToken: [
    body('userId')
      .notEmpty().withMessage('User ID expected')
      .isString().withMessage('User ID must be string')
  ]
}

export const channelValidation = {
  createChannel: [
    body('type')
      .notEmpty().withMessage('Channel type expected')
      .isString().withMessage('Channel type must be string')
      .isIn(Object.values(GetStreamMessagingChannelTypes)).withMessage(`Type must be in: ${Object.values(GetStreamMessagingChannelTypes).join(', ')}`),
    body('id')
      .notEmpty().withMessage('Channel ID expected')
      .isString().withMessage('Channel ID must be string'),
    body('options')
      .isObject().withMessage('Options object expected'),
    body('options.name')
      .optional()
      .isString().withMessage('Name must be string'),
    body('options.blocked')
      .optional()
      .isBoolean().withMessage('Blocked must be boolean')
      .default(false),
    body('options.members')
      .optional()
      .isArray({ min: 2 }).withMessage('Members list must contain at least two IDs'),
    body('options.members.*')
      .notEmpty().withMessage('Member ID expected')
      .isString().withMessage('Member ID must be string')
  ],
  createChannelDistinct: [
    body('type')
      .notEmpty().withMessage('Channel type expected')
      .isString().withMessage('Channel type must be string')
      .isIn(Object.values(GetStreamMessagingChannelTypes)).withMessage(`Type must be in: ${Object.values(GetStreamMessagingChannelTypes).join(', ')}`),
    body('members')
      .isArray({ min: 2 }).withMessage('Members list must contain at least two IDs'),
    body('members.*')
      .notEmpty().withMessage('Member ID expected')
      .isString().withMessage('Member ID must be string')
  ]
}

export const userValidation = {
  createGetStreamUser: [
    body('users')
      .isArray({ min: 1 }).withMessage('Users list must contain at least one user'),
    body('users.*.id')
      .notEmpty().withMessage('User ID expected')
      .isString().withMessage('User ID must be string'),
    body('users.*.name')
      .notEmpty().withMessage('User name expected')
      .isString().withMessage('User name must be string'),
    body('users.*.role')
      .notEmpty().withMessage('User role expected')
      .isString().withMessage('User role must be string')
      .isIn(Object.values(GetStreamMessagingUserRoleTypes)).withMessage(`Role must be in: ${Object.values(GetStreamMessagingUserRoleTypes).join(', ')}`)
  ]
}
