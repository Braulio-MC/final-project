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
import { OrderResult, OrderResultRedis, SearchResult, SearchResultContent, SearchResultContentRedis, SearchResultPagination, SearchResultPaginationRedis, ShoppingCartResult, ShoppingCartResultRedis } from '../types'
import StoreFavorite from '../data/model/StoreFavorite'
import StoreFavoriteDto from '../data/dto/StoreFavoriteDto'
import CategoryParentRedis from '../data/persistance/redis/model/CategoryParentRedis'
import CategoryRedis from '../data/persistance/redis/model/CategoryRedis'
import DeliveryLocationRedis from '../data/persistance/redis/model/DeliveryLocationRedis'
import DiscountRedis from '../data/persistance/redis/model/DiscountRedis'
import OrderDeliveryLocationRedis from '../data/persistance/redis/model/OrderDeliveryLocationRedis'
import OrderLineProductRedis from '../data/persistance/redis/model/OrderLineProductRedis'
import OrderLineRedis from '../data/persistance/redis/model/OrderLineRedis'
import OrderPaymentMethodRedis from '../data/persistance/redis/model/OrderPaymentMethodRedis'
import OrderRedis from '../data/persistance/redis/model/OrderRedis'
import OrderStoreRedis from '../data/persistance/redis/model/OrderStoreRedis'
import OrderUserRedis from '../data/persistance/redis/model/OrderUserRedis'
import PaymentRedis from '../data/persistance/redis/model/PaymentRedis'
import ProductCategoryRedis from '../data/persistance/redis/model/ProductCategoryRedis'
import ProductDiscountRedis from '../data/persistance/redis/model/ProductDiscountRedis'
import ProductFavoriteRedis from '../data/persistance/redis/model/ProductFavoriteRedis'
import ProductRedis from '../data/persistance/redis/model/ProductRedis'
import ProductStoreRedis from '../data/persistance/redis/model/ProductStoreRedis'
import ProductReviewRedis from '../data/persistance/redis/model/ProductReviewRedis'
import ShoppingCartProductRedis from '../data/persistance/redis/model/ShoppingCartProductRedis'
import ShoppingCartRedis from '../data/persistance/redis/model/ShoppingCartRedis'
import ShoppingCartStoreRedis from '../data/persistance/redis/model/ShoppingCartStoreRedis'
import StoreFavoriteRedis from '../data/persistance/redis/model/StoreFavoriteRedis'
import StoreRedis from '../data/persistance/redis/model/StoreRedis'
import StoreReviewRedis from '../data/persistance/redis/model/StoreReviewRedis'

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
    image: String,
    price: Number
  })

  PojosMetadataMap.create<OrderLine>('OrderLine', {
    id: String,
    total: Number,
    quantity: Number,
    product: 'OrderLineProduct',
    createdAt: Date,
    updatedAt: Date,
    paginationKey: String
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
    image: String,
    price: Number
  })

  PojosMetadataMap.create<OrderLineDto>('OrderLineDto', {
    id: String,
    total: Number,
    quantity: Number,
    product: 'OrderLineProductDto',
    createdAt: Timestamp,
    updatedAt: Timestamp,
    paginationKey: String
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
    image: String,
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
    image: String,
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
    image: String,
    price: Number,
    quantity: Number,
    createdAt: Date,
    updatedAt: Date,
    paginationKey: String
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
    image: String,
    price: Number,
    quantity: Number,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    paginationKey: String
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
    image: String,
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
    image: String,
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

  PojosMetadataMap.create<StoreFavorite>('StoreFavorite', {
    id: String,
    name: String,
    description: String,
    image: String,
    phoneNumber: String,
    email: String,
    storeId: String,
    userId: String,
    paginationKey: String,
    createdAt: Date,
    updatedAt: Date
  })

  PojosMetadataMap.create<StoreFavoriteDto>('StoreFavoriteDto', {
    id: String,
    name: String,
    description: String,
    image: String,
    phoneNumber: String,
    email: String,
    storeId: String,
    userId: String,
    paginationKey: String,
    createdAt: Timestamp,
    updatedAt: Timestamp
  })

  //* ********************* Redis metadata ************************

  PojosMetadataMap.create<CategoryParentRedis>('CategoryParentRedis', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<CategoryRedis>('CategoryRedis', {
    id: String,
    name: String,
    parent: 'CategoryParentRedis',
    storeId: String,
    createdAt: Number,
    updatedAt: Number,
    paginationKey: String
  })

  PojosMetadataMap.create<DeliveryLocationRedis>('DeliveryLocationRedis', {
    id: String,
    name: String,
    description: String,
    storeId: String,
    createdAt: Number,
    updatedAt: Number,
    paginationKey: String
  })

  PojosMetadataMap.create<DiscountRedis>('DiscountRedis', {
    id: String,
    percentage: Number,
    startDate: Number,
    endDate: Number,
    storeId: String,
    createdAt: Number,
    updatedAt: Number,
    paginationKey: String
  })

  PojosMetadataMap.create<OrderDeliveryLocationRedis>('OrderDeliveryLocationRedis', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<OrderLineProductRedis>('OrderLineProductRedis', {
    id: String,
    name: String,
    image: String,
    price: Number
  })

  PojosMetadataMap.create<OrderLineRedis>('OrderLineRedis', {
    id: String,
    total: Number,
    quantity: Number,
    product: 'OrderLineProductRedis',
    createdAt: Number,
    updatedAt: Number,
    paginationKey: String
  })

  PojosMetadataMap.create<OrderPaymentMethodRedis>('OrderPaymentMethodRedis', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<OrderStoreRedis>('OrderStoreRedis', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<OrderUserRedis>('OrderUserRedis', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<OrderRedis>('OrderRedis', {
    id: String,
    status: String,
    total: Number,
    createdAt: Number,
    updatedAt: Number,
    store: 'OrderStoreRedis',
    user: 'OrderUserRedis',
    deliveryLocation: 'OrderDeliveryLocationRedis',
    paymentMethod: 'OrderPaymentMethodRedis',
    paginationKey: String
  })

  PojosMetadataMap.create<OrderResultRedis>('OrderResultRedis', {
    id: String,
    status: String,
    total: Number,
    createdAt: Number,
    updatedAt: Number,
    store: 'OrderStoreRedis',
    user: 'OrderUserRedis',
    deliveryLocation: 'OrderDeliveryLocationRedis',
    paymentMethod: 'OrderPaymentMethodRedis',
    orderLines: ['OrderLineRedis'],
    paginationKey: String
  })

  PojosMetadataMap.create<PaymentRedis>('PaymentRedis', {
    id: String,
    name: String,
    description: String,
    createdAt: Number,
    updatedAt: Number,
    paginationKey: String
  })

  PojosMetadataMap.create<ProductCategoryRedis>('ProductCategoryRedis', {
    id: String,
    name: String,
    parentName: String
  })

  PojosMetadataMap.create<ProductDiscountRedis>('ProductDiscountRedis', {
    id: String,
    percentage: Number,
    startDate: Number,
    endDate: Number
  })

  PojosMetadataMap.create<ProductFavoriteRedis>('ProductFavoriteRedis', {
    id: String,
    userId: String,
    productId: String,
    productName: String,
    productImage: String,
    productDescription: String,
    createdAt: Number,
    updatedAt: Number,
    paginationKey: String
  })

  PojosMetadataMap.create<ProductStoreRedis>('ProductStoreRedis', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<ProductRedis>('ProductRedis', {
    id: String,
    name: String,
    description: String,
    image: String,
    price: Number,
    quantity: Number,
    createdAt: Number,
    updatedAt: Number,
    store: 'ProductStoreRedis',
    category: 'ProductCategoryRedis',
    discount: 'ProductDiscountRedis',
    paginationKey: String
  })

  PojosMetadataMap.create<ProductReviewRedis>('ProductReviewRedis', {
    id: String,
    userId: String,
    productId: String,
    rating: Number,
    createdAt: Number,
    updatedAt: Number,
    paginationKey: String
  })

  PojosMetadataMap.create<ShoppingCartProductRedis>('ShoppingCartProductRedis', {
    objectId: String,
    id: String,
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    createdAt: Number,
    updatedAt: Number,
    paginationKey: String
  })

  PojosMetadataMap.create<ShoppingCartStoreRedis>('ShoppingCartStoreRedis', {
    id: String,
    name: String
  })

  PojosMetadataMap.create<ShoppingCartRedis>('ShoppingCartRedis', {
    id: String,
    userId: String,
    createdAt: Number,
    updatedAt: Number,
    store: 'ShoppingCartStoreRedis',
    paginationKey: String
  })

  PojosMetadataMap.create<ShoppingCartResultRedis>('ShoppingCartResultRedis', {
    id: String,
    userId: String,
    createdAt: Number,
    updatedAt: Number,
    store: 'ShoppingCartStoreRedis',
    products: ['ShoppingCartProductRedis'],
    paginationKey: String
  })

  PojosMetadataMap.create<StoreFavoriteRedis>('StoreFavoriteRedis', {
    id: String,
    userId: String,
    storeId: String,
    name: String,
    image: String,
    description: String,
    email: String,
    phoneNumber: String,
    createdAt: Number,
    updatedAt: Number,
    paginationKey: String
  })

  PojosMetadataMap.create<StoreRedis>('StoreRedis', {
    id: String,
    name: String,
    description: String,
    email: String,
    phoneNumber: String,
    image: String,
    userId: String,
    createdAt: Number,
    updatedAt: Number,
    paginationKey: String
  })

  PojosMetadataMap.create<StoreReviewRedis>('StoreReviewRedis', {
    id: String,
    userId: String,
    storeId: String,
    rating: Number,
    createdAt: Number,
    updatedAt: Number,
    paginationKey: String
  })

  PojosMetadataMap.create<SearchResultContent>('SearchResultContent', {
    id: String,
    name: String,
    image: String,
    type: String,
    description1: String,
    description2: String
  })

  PojosMetadataMap.create<SearchResultPagination>('SearchResultPagination', {
    currentPage: Number,
    nbHits: Number,
    nbPages: Number
  })

  PojosMetadataMap.create<SearchResult>('SearchResult', {
    data: ['SearchResultContent'],
    pagination: 'SearchResultPagination'
  })

  PojosMetadataMap.create<SearchResultContentRedis>('SearchResultContentRedis', {
    id: String,
    name: String,
    image: String,
    type: String,
    description1: String,
    description2: String
  })

  PojosMetadataMap.create<SearchResultPaginationRedis>('SearchResultPaginationRedis', {
    currentPage: Number,
    nbHits: Number,
    nbPages: Number
  })

  PojosMetadataMap.create<SearchResult>('SearchResult', {
    data: ['SearchResultContentRedis'],
    pagination: 'SearchResultPaginationRedis'
  })
  //* ******************************************************

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
      (destination) => destination.startDate, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.endDate, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    ),
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
      (destination) => destination.startDate, mapFrom((source) => source.startDate?.toDate())
    ),
    forMember(
      (destination) => destination.endDate, mapFrom((source) => source.endDate?.toDate())
    ),
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
    'OrderLineDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
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
    'OrderLine',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
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

  createMap<OrderResultRedis, OrderResult>(
    mapper,
    'OrderResultRedis',
    'OrderResult',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<OrderResult, OrderResultRedis>(
    mapper,
    'OrderResult',
    'OrderResultRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
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
    'ShoppingCartProductDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
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
    'ShoppingCartProduct',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
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

  createMap<ShoppingCartResultRedis, ShoppingCartResult>(
    mapper,
    'ShoppingCartResultRedis',
    'ShoppingCartResult',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<ShoppingCartResult, ShoppingCartResultRedis>(
    mapper,
    'ShoppingCartResult',
    'ShoppingCartResultRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
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

  createMap<StoreFavorite, StoreFavoriteDto>(
    mapper,
    'StoreFavorite',
    'StoreFavoriteDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromDate(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromDate(source.updatedAt))
    )
  )

  createMap<StoreFavoriteDto, StoreFavorite>(
    mapper,
    'StoreFavoriteDto',
    'StoreFavorite',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toDate())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toDate())
    )
  )

  //* ********************* redis to dto / dto to redis metadata ************************

  createMap<CategoryParentRedis, CategoryDtoParent>(
    mapper,
    'CategoryParentRedis',
    'CategoryDtoParent'
  )

  createMap<CategoryDtoParent, CategoryParentRedis>(
    mapper,
    'CategoryDtoParent',
    'CategoryParentRedis'
  )

  createMap<CategoryRedis, CategoryDto>(
    mapper,
    'CategoryRedis',
    'CategoryDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<CategoryDto, CategoryRedis>(
    mapper,
    'CategoryDto',
    'CategoryRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<DeliveryLocationRedis, DeliveryLocationDto>(
    mapper,
    'DeliveryLocationRedis',
    'DeliveryLocationDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<DeliveryLocationDto, DeliveryLocationRedis>(
    mapper,
    'DeliveryLocationDto',
    'DeliveryLocationRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<DiscountRedis, DiscountDto>(
    mapper,
    'DiscountRedis',
    'DiscountDto',
    forMember(
      (destination) => destination.startDate, mapFrom((source) => Timestamp.fromMillis(source.startDate))
    ),
    forMember(
      (destination) => destination.endDate, mapFrom((source) => Timestamp.fromMillis(source.endDate))
    ),
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<DiscountDto, DiscountRedis>(
    mapper,
    'DiscountDto',
    'DiscountRedis',
    forMember(
      (destination) => destination.startDate, mapFrom((source) => source.startDate?.toMillis())
    ),
    forMember(
      (destination) => destination.endDate, mapFrom((source) => source.endDate?.toMillis())
    ),
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<OrderDeliveryLocationRedis, OrderDeliveryLocationDto>(
    mapper,
    'OrderDeliveryLocationRedis',
    'OrderDeliveryLocationDto'
  )

  createMap<OrderDeliveryLocationDto, OrderDeliveryLocationRedis>(
    mapper,
    'OrderDeliveryLocationDto',
    'OrderDeliveryLocationRedis'
  )

  createMap<OrderLineProductRedis, OrderLineProductDto>(
    mapper,
    'OrderLineProductRedis',
    'OrderLineProductDto'
  )

  createMap<OrderLineProductDto, OrderLineProductRedis>(
    mapper,
    'OrderLineProductDto',
    'OrderLineProductRedis'
  )

  createMap<OrderLineRedis, OrderLineDto>(
    mapper,
    'OrderLineRedis',
    'OrderLineDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<OrderLineDto, OrderLineRedis>(
    mapper,
    'OrderLineDto',
    'OrderLineRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<OrderPaymentMethodRedis, OrderPaymentMethodDto>(
    mapper,
    'OrderPaymentMethodRedis',
    'OrderPaymentMethodDto'
  )

  createMap<OrderPaymentMethodDto, OrderPaymentMethodRedis>(
    mapper,
    'OrderPaymentMethodDto',
    'OrderPaymentMethodRedis'
  )

  createMap<OrderStoreRedis, OrderStoreDto>(
    mapper,
    'OrderStoreRedis',
    'OrderStoreDto'
  )

  createMap<OrderStoreDto, OrderStoreRedis>(
    mapper,
    'OrderStoreDto',
    'OrderStoreRedis'
  )

  createMap<OrderUserRedis, OrderUserDto>(
    mapper,
    'OrderUserRedis',
    'OrderUserDto'
  )

  createMap<OrderUserDto, OrderUserRedis>(
    mapper,
    'OrderUserDto',
    'OrderUserRedis'
  )

  createMap<OrderRedis, OrderDto>(
    mapper,
    'OrderRedis',
    'OrderDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<OrderDto, OrderRedis>(
    mapper,
    'OrderDto',
    'OrderRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<PaymentRedis, PaymentDto>(
    mapper,
    'PaymentRedis',
    'PaymentDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<PaymentDto, PaymentRedis>(
    mapper,
    'PaymentDto',
    'PaymentRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<ProductCategoryRedis, ProductCategoryDto>(
    mapper,
    'ProductCategoryRedis',
    'ProductCategoryDto'
  )

  createMap<ProductCategoryDto, ProductCategoryRedis>(
    mapper,
    'ProductCategoryDto',
    'ProductCategoryRedis'
  )

  createMap<ProductDiscountRedis, ProductDiscountDto>(
    mapper,
    'ProductDiscountRedis',
    'ProductDiscountDto',
    forMember(
      (destination) => destination.startDate, mapFrom((source) => Timestamp.fromMillis(source.startDate))
    ),
    forMember(
      (destination) => destination.endDate, mapFrom((source) => Timestamp.fromMillis(source.endDate))
    )
  )

  createMap<ProductDiscountDto, ProductDiscountRedis>(
    mapper,
    'ProductDiscountDto',
    'ProductDiscountRedis',
    forMember(
      (destination) => destination.startDate, mapFrom((source) => source.startDate?.toMillis())
    ),
    forMember(
      (destination) => destination.endDate, mapFrom((source) => source.endDate?.toMillis())
    )
  )

  createMap<ProductFavoriteRedis, ProductFavoriteDto>(
    mapper,
    'ProductFavoriteRedis',
    'ProductFavoriteDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<ProductFavoriteDto, ProductFavoriteRedis>(
    mapper,
    'ProductFavoriteDto',
    'ProductFavoriteRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<ProductStoreRedis, ProductStoreDto>(
    mapper,
    'ProductStoreRedis',
    'ProductStoreDto'
  )

  createMap<ProductStoreDto, ProductStoreRedis>(
    mapper,
    'ProductStoreDto',
    'ProductStoreRedis'
  )

  createMap<ProductRedis, ProductDto>(
    mapper,
    'ProductRedis',
    'ProductDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<ProductDto, ProductRedis>(
    mapper,
    'ProductDto',
    'ProductRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<ProductReviewRedis, ProductReviewDto>(
    mapper,
    'ProductReviewRedis',
    'ProductReviewDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<ProductReviewDto, ProductReviewRedis>(
    mapper,
    'ProductReviewDto',
    'ProductReviewRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<ShoppingCartProductRedis, ShoppingCartProductDto>(
    mapper,
    'ShoppingCartProductRedis',
    'ShoppingCartProductDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<ShoppingCartProductDto, ShoppingCartProductRedis>(
    mapper,
    'ShoppingCartProductDto',
    'ShoppingCartProductRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<ShoppingCartStoreRedis, ShoppingCartStoreDto>(
    mapper,
    'ShoppingCartStoreRedis',
    'ShoppingCartStoreDto'
  )

  createMap<ShoppingCartStoreDto, ShoppingCartStoreRedis>(
    mapper,
    'ShoppingCartStoreDto',
    'ShoppingCartStoreRedis'
  )

  createMap<ShoppingCartRedis, ShoppingCartDto>(
    mapper,
    'ShoppingCartRedis',
    'ShoppingCartDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<ShoppingCartDto, ShoppingCartRedis>(
    mapper,
    'ShoppingCartDto',
    'ShoppingCartRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<StoreFavoriteRedis, StoreFavoriteDto>(
    mapper,
    'StoreFavoriteRedis',
    'StoreFavoriteDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<StoreFavoriteDto, StoreFavoriteRedis>(
    mapper,
    'StoreFavoriteDto',
    'StoreFavoriteRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<StoreRedis, StoreDto>(
    mapper,
    'StoreRedis',
    'StoreDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<StoreDto, StoreRedis>(
    mapper,
    'StoreDto',
    'StoreRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )

  createMap<StoreReviewRedis, StoreReviewDto>(
    mapper,
    'StoreReviewRedis',
    'StoreReviewDto',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => Timestamp.fromMillis(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => Timestamp.fromMillis(source.updatedAt))
    )
  )

  createMap<StoreReviewDto, StoreReviewRedis>(
    mapper,
    'StoreReviewDto',
    'StoreReviewRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt?.toMillis())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt?.toMillis())
    )
  )
  //* ***************************************************************

  //* ********************* redis to domain / domain to redis metadata ************************

  createMap<CategoryParentRedis, CategoryParent>(
    mapper,
    'CategoryParentRedis',
    'CategoryParent'
  )

  createMap<CategoryParent, CategoryParentRedis>(
    mapper,
    'CategoryParent',
    'CategoryParentRedis'
  )

  createMap<CategoryRedis, Category>(
    mapper,
    'CategoryRedis',
    'Category',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<Category, CategoryRedis>(
    mapper,
    'Category',
    'CategoryRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<DeliveryLocationRedis, DeliveryLocation>(
    mapper,
    'DeliveryLocationRedis',
    'DeliveryLocation',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<DeliveryLocation, DeliveryLocationRedis>(
    mapper,
    'DeliveryLocation',
    'DeliveryLocationRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<DiscountRedis, Discount>(
    mapper,
    'DiscountRedis',
    'Discount',
    forMember(
      (destination) => destination.startDate, mapFrom((source) => new Date(source.startDate))
    ),
    forMember(
      (destination) => destination.endDate, mapFrom((source) => new Date(source.endDate))
    ),
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<Discount, DiscountRedis>(
    mapper,
    'Discount',
    'DiscountRedis',
    forMember(
      (destination) => destination.startDate, mapFrom((source) => source.startDate.getTime())
    ),
    forMember(
      (destination) => destination.endDate, mapFrom((source) => source.endDate.getTime())
    ),
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<OrderDeliveryLocationRedis, OrderDeliveryLocation>(
    mapper,
    'OrderDeliveryLocationRedis',
    'OrderDeliveryLocation'
  )

  createMap<OrderDeliveryLocation, OrderDeliveryLocationRedis>(
    mapper,
    'OrderDeliveryLocation',
    'OrderDeliveryLocationRedis'
  )

  createMap<OrderLineProductRedis, OrderLineProduct>(
    mapper,
    'OrderLineProductRedis',
    'OrderLineProduct'
  )

  createMap<OrderLineProduct, OrderLineProductRedis>(
    mapper,
    'OrderLineProduct',
    'OrderLineProductRedis'
  )

  createMap<OrderLineRedis, OrderLine>(
    mapper,
    'OrderLineRedis',
    'OrderLine',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<OrderLine, OrderLineRedis>(
    mapper,
    'OrderLine',
    'OrderLineRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<OrderPaymentMethodRedis, OrderPaymentMethod>(
    mapper,
    'OrderPaymentMethodRedis',
    'OrderPaymentMethod'
  )

  createMap<OrderPaymentMethod, OrderPaymentMethodRedis>(
    mapper,
    'OrderPaymentMethod',
    'OrderPaymentMethodRedis'
  )

  createMap<OrderStoreRedis, OrderStore>(
    mapper,
    'OrderStoreRedis',
    'OrderStore'
  )

  createMap<OrderStore, OrderStoreRedis>(
    mapper,
    'OrderStore',
    'OrderStoreRedis'
  )

  createMap<OrderUserRedis, OrderUser>(
    mapper,
    'OrderUserRedis',
    'OrderUser'
  )

  createMap<OrderUser, OrderUserRedis>(
    mapper,
    'OrderUser',
    'OrderUserRedis'
  )

  createMap<OrderRedis, Order>(
    mapper,
    'OrderRedis',
    'Order',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<Order, OrderRedis>(
    mapper,
    'Order',
    'OrderRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<OrderResultRedis, Order>(
    mapper,
    'OrderResultRedis',
    'Order',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<Order, OrderResultRedis>(
    mapper,
    'Order',
    'OrderResultRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<PaymentRedis, Payment>(
    mapper,
    'PaymentRedis',
    'Payment',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<Payment, PaymentRedis>(
    mapper,
    'Payment',
    'PaymentRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<ProductCategoryRedis, ProductCategory>(
    mapper,
    'ProductCategoryRedis',
    'ProductCategory'
  )

  createMap<ProductCategory, ProductCategoryRedis>(
    mapper,
    'ProductCategory',
    'ProductCategoryRedis'
  )

  createMap<ProductDiscountRedis, ProductDiscount>(
    mapper,
    'ProductDiscountRedis',
    'ProductDiscount',
    forMember(
      (destination) => destination.startDate, mapFrom((source) => new Date(source.startDate))
    ),
    forMember(
      (destination) => destination.endDate, mapFrom((source) => new Date(source.endDate))
    )
  )

  createMap<ProductDiscount, ProductDiscountRedis>(
    mapper,
    'ProductDiscount',
    'ProductDiscountRedis',
    forMember(
      (destination) => destination.startDate, mapFrom((source) => source.startDate.getTime())
    ),
    forMember(
      (destination) => destination.endDate, mapFrom((source) => source.endDate.getTime())
    )
  )

  createMap<ProductFavoriteRedis, ProductFavorite>(
    mapper,
    'ProductFavoriteRedis',
    'ProductFavorite',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<ProductFavorite, ProductFavoriteRedis>(
    mapper,
    'ProductFavorite',
    'ProductFavoriteRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<ProductStoreRedis, ProductStore>(
    mapper,
    'ProductStoreRedis',
    'ProductStore'
  )

  createMap<ProductStore, ProductStoreRedis>(
    mapper,
    'ProductStore',
    'ProductStoreRedis'
  )

  createMap<ProductRedis, Product>(
    mapper,
    'ProductRedis',
    'Product',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<Product, ProductRedis>(
    mapper,
    'Product',
    'ProductRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<ProductReviewRedis, ProductReview>(
    mapper,
    'ProductReviewRedis',
    'ProductReview',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<ProductReview, ProductReviewRedis>(
    mapper,
    'ProductReview',
    'ProductReviewRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<ShoppingCartProductRedis, ShoppingCartProduct>(
    mapper,
    'ShoppingCartProductRedis',
    'ShoppingCartProduct',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<ShoppingCartProduct, ShoppingCartProductRedis>(
    mapper,
    'ShoppingCartProduct',
    'ShoppingCartProductRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<ShoppingCartStoreRedis, ShoppingCartStore>(
    mapper,
    'ShoppingCartStoreRedis',
    'ShoppingCartStore'
  )

  createMap<ShoppingCartStore, ShoppingCartStoreRedis>(
    mapper,
    'ShoppingCartStore',
    'ShoppingCartStoreRedis'
  )

  createMap<ShoppingCartRedis, ShoppingCart>(
    mapper,
    'ShoppingCartRedis',
    'ShoppingCart',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<ShoppingCart, ShoppingCartRedis>(
    mapper,
    'ShoppingCart',
    'ShoppingCartRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<ShoppingCartResultRedis, ShoppingCart>(
    mapper,
    'ShoppingCartResultRedis',
    'ShoppingCart',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<ShoppingCart, ShoppingCartResultRedis>(
    mapper,
    'ShoppingCart',
    'ShoppingCartResultRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<StoreFavoriteRedis, StoreFavorite>(
    mapper,
    'StoreFavoriteRedis',
    'StoreFavorite',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<StoreFavorite, StoreFavoriteRedis>(
    mapper,
    'StoreFavorite',
    'StoreFavoriteRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<StoreRedis, Store>(
    mapper,
    'StoreRedis',
    'Store',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<Store, StoreRedis>(
    mapper,
    'Store',
    'StoreRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )

  createMap<StoreReviewRedis, StoreReview>(
    mapper,
    'StoreReviewRedis',
    'StoreReview',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => new Date(source.createdAt))
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => new Date(source.updatedAt))
    )
  )

  createMap<StoreReview, StoreReviewRedis>(
    mapper,
    'StoreReview',
    'StoreReviewRedis',
    forMember(
      (destination) => destination.createdAt, mapFrom((source) => source.createdAt.getTime())
    ),
    forMember(
      (destination) => destination.updatedAt, mapFrom((source) => source.updatedAt.getTime())
    )
  )
  //* ***************************************************************

  //* ********* search dto to redis / redis to search dto ***********

  createMap<SearchResultContentRedis, SearchResultContent>(
    mapper,
    'SearchResultContentRedis',
    'SearchResultContent'
  )

  createMap<SearchResultContent, SearchResultContentRedis>(
    mapper,
    'SearchResultContent',
    'SearchResultContentRedis'
  )

  //* *****************************************************************
}

export default mapper
