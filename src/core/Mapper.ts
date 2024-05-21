import { createMapper, forMember, mapFrom, createMap } from '@automapper/core'
import { PojosMetadataMap, pojos } from '@automapper/pojos'
import { Timestamp } from 'firebase-admin/firestore'
import CategoryParent from '../data/model/CategoryParent'
import Category from '../data/model/Category'
import CategoryDtoParent from '../data/dto/CategoryDtoParent'
import CategoryDto from '../data/dto/CategoryDto'
import DeliveryLocation from '../data/model/DeliveryLocation'
import DeliveryLocationDto from '../data/dto/DeliveryLocationDto'
import Discount from '../data/model/Discount'
import DiscountDto from '../data/dto/DiscountDto'
import Order from '../data/model/Order'
import OrderStore from '../data/model/OrderStore'
import OrderUser from '../data/model/OrderUser'
import OrderDeliveryLocation from '../data/model/OrderDeliveryLocation'
import OrderPaymentMethod from '../data/model/OrderPaymentMethod'
import OrderLine from '../data/model/OrderLine'
import OrderLineProduct from '../data/model/OrderLineProduct'
import OrderStoreDto from '../data/dto/OrderStoreDto'
import OrderUserDto from '../data/dto/OrderUserDto'
import OrderDeliveryLocationDto from '../data/dto/OrderDeliveryLocationDto'
import OrderPaymentMethodDto from '../data/dto/OrderPaymentMethodDto'
import OrderLineProductDto from '../data/dto/OrderLineProductDto'
import OrderLineDto from '../data/dto/OrderLineDto'
import OrderDto from '../data/dto/OrderDto'
import Payment from '../data/model/Payment'
import PaymentDto from '../data/dto/PaymentDto'
import ProductStore from '../data/model/ProductStore'
import ProductCategory from '../data/model/ProductCategory'
import ProductDiscount from '../data/model/ProductDiscount'
import Product from '../data/model/Product'
import ProductStoreDto from '../data/dto/ProductStoreDto'
import ProductCategoryDto from '../data/dto/ProductCategoryDto'
import ProductDiscountDto from '../data/dto/ProductDiscountDto'
import ProductDto from '../data/dto/ProductDto'
import ProductReview from '../data/model/ProductReview'
import ProductReviewDto from '../data/dto/ProductReviewDto'
import ProductFavorite from '../data/model/ProductFavorite'
import ProductFavoriteDto from '../data/dto/ProductFavoriteDto'
import ShoppingCartStoreDto from '../data/dto/ShoppingCartStoreDto'
import ShoppingCartProductDto from '../data/dto/ShoppingCartProductDto'
import ShoppingCartDto from '../data/dto/ShoppingCartDto'
import ShoppingCartStore from '../data/model/ShoppingCartStore'
import ShoppingCartProduct from '../data/model/ShoppingCartProduct'
import ShoppingCart from '../data/model/ShoppingCart'
import Store from '../data/model/Store'
import StoreDto from '../data/dto/StoreDto'
import StoreReview from '../data/model/StoreReview'
import StoreReviewDto from '../data/dto/StoreReviewDto'
import { OrderResult, ShoppingCartResult } from '../types'

const mapper = createMapper({
  strategyInitializer: pojos()
})

export function createMappings (): void {
  PojosMetadataMap.create<CategoryParent>('CategoryParent', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<Category>('Category', {
    id: String,
    name: String,
    parent: 'CategoryParent',
    storeId: String,
    createdAt: Date,
    updatedAt: Date,
    paginationKey: String
  })

  PojosMetadataMap.create<CategoryDtoParent>('CategoryDtoParent', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<CategoryDto>('CategoryDto', {
    id: String,
    name: String,
    parent: 'CategoryDtoParent',
    storeId: String,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    paginationKey: String
  })

  PojosMetadataMap.create<DeliveryLocation>('DeliveryLocation', {
    id: String,
    name: String,
    description: String,
    storeId: String,
    createdAt: Date,
    updatedAt: Date,
    paginationKey: String
  })

  PojosMetadataMap.create<DeliveryLocationDto>('DeliveryLocationDto', {
    id: String,
    name: String,
    description: String,
    storeId: String,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    paginationKey: String
  })

  PojosMetadataMap.create<Discount>('Discount', {
    id: String,
    percentage: Number,
    startDate: Date,
    endDate: Date,
    storeId: String,
    createdAt: Date,
    updatedAt: Date,
    paginationKey: String
  })

  PojosMetadataMap.create<DiscountDto>('DiscountDto', {
    id: String,
    percentage: Number,
    startDate: Timestamp,
    endDate: Timestamp,
    storeId: String,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    paginationKey: String
  })

  PojosMetadataMap.create<OrderStore>('OrderStore', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<OrderUser>('OrderUser', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<OrderDeliveryLocation>('OrderDeliveryLocation', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<OrderPaymentMethod>('OrderPaymentMethod', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<OrderLineProduct>('OrderLineProduct', {
    id: String,
    name: String,
    image: URL,
    price: Number
  })

  PojosMetadataMap.create<OrderLine>('OrderLine', {
    id: String,
    total: Number,
    quantity: Number,
    product: 'OrderLineProduct'
  })

  PojosMetadataMap.create<Order>('Order', {
    id: String,
    status: String,
    total: Number,
    createdAt: Date,
    updatedAt: Date,
    store: 'OrderStore',
    user: 'OrderUser',
    deliveryLocation: 'OrderDeliveryLocation',
    paymentMethod: 'OrderPaymentMethod',
    orderLines: ['OrderLine'],
    paginationKey: String
  })

  PojosMetadataMap.create<OrderStoreDto>('OrderStoreDto', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<OrderUserDto>('OrderUserDto', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<OrderDeliveryLocationDto>('OrderDeliveryLocationDto', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<OrderPaymentMethodDto>('OrderPaymentMethodDto', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<OrderLineProductDto>('OrderLineProductDto', {
    id: String,
    name: String,
    image: URL,
    price: Number
  })

  PojosMetadataMap.create<OrderLineDto>('OrderLineDto', {
    id: String,
    total: Number,
    quantity: Number,
    product: 'OrderLineProductDto'
  })

  PojosMetadataMap.create<OrderDto>('OrderDto', {
    id: String,
    status: String,
    total: Number,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    store: 'OrderStoreDto',
    user: 'OrderUserDto',
    deliveryLocation: 'OrderDeliveryLocationDto',
    paymentMethod: 'OrderPaymentMethodDto',
    paginationKey: String
  })

  PojosMetadataMap.create<OrderResult>('OrderResult', {
    id: String,
    status: String,
    total: Number,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    store: 'OrderStoreDto',
    user: 'OrderUserDto',
    deliveryLocation: 'OrderDeliveryLocationDto',
    paymentMethod: 'OrderPaymentMethodDto',
    orderLines: ['OrderLineDto'],
    paginationKey: String
  })

  PojosMetadataMap.create<Payment>('Payment', {
    id: String,
    name: String,
    description: String,
    createdAt: Date,
    updatedAt: Date,
    paginationKey: String
  })

  PojosMetadataMap.create<PaymentDto>('PaymentDto', {
    id: String,
    name: String,
    description: String,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    paginationKey: String
  })

  PojosMetadataMap.create<ProductStore>('ProductStore', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<ProductCategory>('ProductCategory', {
    id: String,
    name: String,
    parentName: String
  })

  PojosMetadataMap.create<ProductDiscount>('ProductDiscount', {
    id: String,
    percentage: Number,
    startDate: Date,
    endDate: Date
  })

  PojosMetadataMap.create<Product>('Product', {
    id: String,
    name: String,
    description: String,
    image: URL,
    price: Number,
    quantity: Number,
    rating: Number,
    createdAt: Date,
    updatedAt: Date,
    store: 'ProductStore',
    category: 'ProductCategory',
    discount: 'ProductDiscount',
    paginationKey: String
  })

  PojosMetadataMap.create<ProductStoreDto>('ProductStoreDto', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<ProductCategoryDto>('ProductCategoryDto', {
    id: String,
    name: String,
    parentName: String
  })

  PojosMetadataMap.create<ProductDiscountDto>('ProductDiscountDto', {
    id: String,
    percentage: Number,
    startDate: Timestamp,
    endDate: Timestamp
  })

  PojosMetadataMap.create<ProductDto>('ProductDto', {
    id: String,
    name: String,
    description: String,
    image: URL,
    price: Number,
    quantity: Number,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    store: 'ProductStoreDto',
    category: 'ProductCategoryDto',
    discount: 'ProductDiscountDto',
    paginationKey: String
  })

  PojosMetadataMap.create<ProductReview>('ProductReview', {
    id: String,
    userId: String,
    productId: String,
    rating: Number,
    createdAt: Date,
    updatedAt: Date,
    paginationKey: String
  })

  PojosMetadataMap.create<ProductReviewDto>('ProductReviewDto', {
    id: String,
    userId: String,
    productId: String,
    rating: Number,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    paginationKey: String
  })

  PojosMetadataMap.create<ProductFavorite>('ProductFavorite', {
    id: String,
    userId: String,
    productId: String,
    productName: String,
    productImage: String,
    productDescription: String,
    createdAt: Date,
    updatedAt: Date,
    paginationKey: String
  })

  PojosMetadataMap.create<ProductFavoriteDto>('ProductFavoriteDto', {
    id: String,
    userId: String,
    productId: String,
    productName: String,
    productImage: String,
    productDescription: String,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    paginationKey: String
  })

  PojosMetadataMap.create<ShoppingCartStore>('ShoppingCartStore', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<ShoppingCartProduct>('ShoppingCartProduct', {
    objectId: String,
    id: String,
    name: String,
    image: URL,
    price: Number,
    quantity: Number
  })

  PojosMetadataMap.create<ShoppingCart>('ShoppingCart', {
    id: String,
    userId: String,
    createdAt: Date,
    updatedAt: Date,
    store: 'ShoppingCartStore',
    products: ['ShoppingCartProduct'],
    paginationKey: String
  })

  PojosMetadataMap.create<ShoppingCartStoreDto>('ShoppingCartStoreDto', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<ShoppingCartProductDto>('ShoppingCartProductDto', {
    objectId: String,
    id: String,
    name: String,
    image: URL,
    price: Number,
    quantity: Number
  })

  PojosMetadataMap.create<ShoppingCartDto>('ShoppingCartDto', {
    id: String,
    userId: String,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    store: 'ShoppingCartStoreDto',
    paginationKey: String
  })

  PojosMetadataMap.create<ShoppingCartResult>('ShoppingCartResult', {
    id: String,
    userId: String,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    store: 'ShoppingCartStoreDto',
    products: ['ShoppingCartProductDto'],
    paginationKey: String
  })

  PojosMetadataMap.create<Store>('Store', {
    id: String,
    name: String,
    description: String,
    email: String,
    image: URL,
    phoneNumber: String,
    userId: String,
    createdAt: Date,
    updatedAt: Date,
    paginationKey: String
  })

  PojosMetadataMap.create<StoreDto>('StoreDto', {
    id: String,
    name: String,
    description: String,
    email: String,
    image: URL,
    phoneNumber: String,
    userId: String,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    paginationKey: String
  })

  PojosMetadataMap.create<StoreReview>('StoreReview', {
    id: String,
    userId: String,
    storeId: String,
    rating: Number,
    createdAt: Date,
    updatedAt: Date,
    paginationKey: String
  })

  PojosMetadataMap.create<StoreReviewDto>('StoreReviewDto', {
    id: String,
    userId: String,
    storeId: String,
    rating: Number,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    paginationKey: String
  })

  //! ##################### Mappers ########################

  createMap<CategoryParent, CategoryDtoParent>(
    mapper,
    'CategoryParent',
    'CategoryDtoParent'
  )

  createMap<CategoryDtoParent, CategoryParent>(
    mapper,
    'CategoryDtoParent',
    'CategoryParent'
  )

  createMap<Category, CategoryDto>(
    mapper,
    'Category',
    'CategoryDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<CategoryDto, Category>(
    mapper,
    'CategoryDto',
    'Category',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  createMap<DeliveryLocation, DeliveryLocationDto>(
    mapper,
    'DeliveryLocation',
    'DeliveryLocationDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<DeliveryLocationDto, DeliveryLocation>(
    mapper,
    'DeliveryLocationDto',
    'DeliveryLocation',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  createMap<Discount, DiscountDto>(
    mapper,
    'Discount',
    'DiscountDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<DiscountDto, Discount>(
    mapper,
    'DiscountDto',
    'Discount',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  createMap<OrderStore, OrderStoreDto>(
    mapper,
    'OrderStore',
    'OrderStoreDto'
  )

  createMap<OrderUser, OrderUserDto>(
    mapper,
    'OrderUser',
    'OrderUserDto'
  )

  createMap<OrderDeliveryLocation, OrderDeliveryLocationDto>(
    mapper,
    'OrderDeliveryLocation',
    'OrderDeliveryLocationDto'
  )

  createMap<OrderPaymentMethod, OrderPaymentMethodDto>(
    mapper,
    'OrderPaymentMethod',
    'OrderPaymentMethodDto'
  )

  createMap<OrderLineProduct, OrderLineProductDto>(
    mapper,
    'OrderLineProduct',
    'OrderLineProductDto'
  )

  createMap<OrderLine, OrderLineDto>(
    mapper,
    'OrderLine',
    'OrderLineDto'
  )

  createMap<Order, OrderDto>(
    mapper,
    'Order',
    'OrderDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<OrderStoreDto, OrderStore>(
    mapper,
    'OrderStoreDto',
    'OrderStore'
  )

  createMap<OrderUserDto, OrderUser>(
    mapper,
    'OrderUserDto',
    'OrderUser'
  )

  createMap<OrderDeliveryLocationDto, OrderDeliveryLocation>(
    mapper,
    'OrderDeliveryLocationDto',
    'OrderDeliveryLocation'
  )

  createMap<OrderPaymentMethodDto, OrderPaymentMethod>(
    mapper,
    'OrderPaymentMethodDto',
    'OrderPaymentMethod'
  )

  createMap<OrderLineProductDto, OrderLineProduct>(
    mapper,
    'OrderLineProductDto',
    'OrderLineProduct'
  )

  createMap<OrderLineDto, OrderLine>(
    mapper,
    'OrderLineDto',
    'OrderLine'
  )

  createMap<OrderDto, Order>(
    mapper,
    'OrderDto',
    'Order',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  createMap<OrderResult, Order>(
    mapper,
    'OrderResult',
    'Order',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  createMap<Order, OrderResult>(
    mapper,
    'Order',
    'OrderResult',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<Payment, PaymentDto>(
    mapper,
    'Payment',
    'PaymentDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<PaymentDto, Payment>(
    mapper,
    'PaymentDto',
    'Payment',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  createMap<ProductStore, ProductStoreDto>(
    mapper,
    'ProductStore',
    'ProductStoreDto'
  )

  createMap<ProductStoreDto, ProductStore>(
    mapper,
    'ProductStoreDto',
    'ProductStore'
  )

  createMap<ProductCategory, ProductCategoryDto>(
    mapper,
    'ProductCategory',
    'ProductCategoryDto'
  )

  createMap<ProductCategoryDto, ProductCategory>(
    mapper,
    'ProductCategoryDto',
    'ProductCategory'
  )

  createMap<ProductDiscount, ProductDiscountDto>(
    mapper,
    'ProductDiscount',
    'ProductDiscountDto',
    forMember(
      (destination) => destination.startDate, mapFrom((source) => Timestamp.fromDate(source.startDate))
    ),
    forMember(
      (destination) => destination.endDate, mapFrom((source) => Timestamp.fromDate(source.endDate))
    )
  )

  createMap<ProductDiscountDto, ProductDiscount>(
    mapper,
    'ProductDiscountDto',
    'ProductDiscount',
    forMember(
      (destination) => destination.startDate, mapFrom((source) => source.startDate?.toDate())
    ),
    forMember(
      (destination) => destination.endDate, mapFrom((source) => source.endDate?.toDate())
    )
  )

  createMap<Product, ProductDto>(
    mapper,
    'Product',
    'ProductDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<ProductDto, Product>(
    mapper,
    'ProductDto',
    'Product',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  createMap<ProductReview, ProductReviewDto>(
    mapper,
    'ProductReview',
    'ProductReviewDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<ProductReviewDto, ProductReview>(
    mapper,
    'ProductReviewDto',
    'ProductReview',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  createMap<ProductFavorite, ProductFavoriteDto>(
    mapper,
    'ProductFavorite',
    'ProductFavoriteDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<ProductFavoriteDto, ProductFavorite>(
    mapper,
    'ProductFavoriteDto',
    'ProductFavorite',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  createMap<ShoppingCartStore, ShoppingCartStoreDto>(
    mapper,
    'ShoppingCartStore',
    'ShoppingCartStoreDto'
  )

  createMap<ShoppingCartProduct, ShoppingCartProductDto>(
    mapper,
    'ShoppingCartProduct',
    'ShoppingCartProductDto'
  )

  createMap<ShoppingCart, ShoppingCartDto>(
    mapper,
    'ShoppingCart',
    'ShoppingCartDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<ShoppingCartStoreDto, ShoppingCartStore>(
    mapper,
    'ShoppingCartStoreDto',
    'ShoppingCartStore'
  )

  createMap<ShoppingCartProductDto, ShoppingCartProduct>(
    mapper,
    'ShoppingCartProductDto',
    'ShoppingCartProduct'
  )

  createMap<ShoppingCartDto, ShoppingCart>(
    mapper,
    'ShoppingCartDto',
    'ShoppingCart',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  createMap<ShoppingCartResult, ShoppingCart>(
    mapper,
    'ShoppingCartResult',
    'ShoppingCart',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  createMap<ShoppingCart, ShoppingCartResult>(
    mapper,
    'ShoppingCart',
    'ShoppingCartResult',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<Store, StoreDto>(
    mapper,
    'Store',
    'StoreDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<StoreDto, Store>(
    mapper,
    'StoreDto',
    'Store',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  createMap<StoreReview, StoreReviewDto>(
    mapper,
    'StoreReview',
    'StoreReviewDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<StoreReviewDto, StoreReview>(
    mapper,
    'StoreReviewDto',
    'StoreReview',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )
}

export default mapper
