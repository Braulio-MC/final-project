import { container } from 'tsyringe'
import { db, firebaseStorage } from '../core/FirebaseHelper'
import CategoryController from '../controllers/Category.controller'
import DeliveryLocationController from '../controllers/DeliveryLocation.controller'
import DiscountController from '../controllers/Discount.controller'
import OrderController from '../controllers/Order.controller'
import FirestoreCategoryRepository from '../data/repository/category/FirestoreCategoryRepository'
import FirestoreDeliveryLocationRepository from '../data/repository/deliverylocation/FirestoreDeliveryLocationRepository'
import FirestoreDiscountRepository from '../data/repository/discount/FirestoreDiscountRepository'
import FirestoreOrderRepository from '../data/repository/order/FirestoreOrderRepository'
import FirestorePaymentRepository from '../data/repository/payment/FirestorePaymentRepository'
import PaymentController from '../controllers/Payment.controller'
import FirestoreProductRepository from '../data/repository/product/FirestoreProductRepository'
import ProductController from '../controllers/Product.controller'
import FirestoreProductReviewRepository from '../data/repository/productreview/FirestoreProductReviewRepository'
import ProductReviewController from '../controllers/ProductReview.controller'
import FirestoreProductFavoriteRepository from '../data/repository/productfavorite/FirestoreProductFavoriteRepository'
import ProductFavoriteController from '../controllers/ProductFavorite.controller'
import FirestoreShoppingCartRepository from '../data/repository/shoppingcart/FirestoreShoppingCartRepository'
import ShoppingCartController from '../controllers/ShoppingCart.controller'
import FirestoreStoreRepository from '../data/repository/store/FirestoreStoreRepository'
import StoreController from '../controllers/Store.controller'
import FirestoreStoreReviewRepository from '../data/repository/storereview/FirestoreStoreReviewRepository'
import StoreReviewController from '../controllers/StoreReview.controller'
import FirestoreStoreFavoriteRepository from '../data/repository/storefavorite/FirestoreStoreFavoriteRepository'
import StoreFavoriteController from '../controllers/StoreFavorite.controller'
import { algoliaClient, algoliaIndex } from '../core/AlgoliaHelper'
import FirestoreSearchRepository from '../data/repository/search/FirestoreSearchRepository'
import SearchController from '../controllers/Search.controller'
import FirestoreOrderlineRepository from '../data/repository/orderline/FirestoreOrderlineRepository'
import FirestoreShoppingCartItemRepository from '../data/repository/shoppingcartitem/FirestoreShoppingCartItemRepository'
import OrderlineController from '../controllers/Orderline.controller'
import ShoppingCartItemController from '../controllers/ShoppingCartItem.controller'
import { redisClient } from '../core/RedisHelper'
import ShoppingCartItemService from '../data/service/shoppingcartitem/ShoppingCartItem.service'
import OrderlineService from '../data/service/orderline/Orderline.service'
import FirebaseStorageRepository from '../data/repository/storage/FirebaseStorageRepository'
import { getStreamClient } from '../core/GetStreamHelper'
import GetStreamTokenProvider from '../data/provider/token/GetStreamTokenProvider'
import TokenController from '../controllers/Token.controller'
import ChannelController from '../controllers/Channel.controller'
import UserController from '../controllers/User.controller'

container.register(
  'FirestoreDB',
  { useValue: db }
)

container.register(
  'FirebaseStorage',
  { useValue: firebaseStorage }
)

container.register(
  'AlgoliaClient',
  { useValue: algoliaClient }
)

container.register(
  'AlgoliaIndex',
  { useValue: algoliaIndex }
)

container.register(
  'RedisClient',
  { useValue: redisClient }
)

container.register(
  'GetStreamClient',
  { useValue: getStreamClient }
)

container.register(
  'StorageRepository',
  { useClass: FirebaseStorageRepository }
)

container.register(
  'CategoryRepository',
  { useClass: FirestoreCategoryRepository }
)

container.register(
  'DeliveryLocationRepository',
  { useClass: FirestoreDeliveryLocationRepository }
)

container.register(
  'DiscountRepository',
  { useClass: FirestoreDiscountRepository }
)

container.register(
  'OrderRepository',
  { useClass: FirestoreOrderRepository }
)

container.register(
  'OrderlineRepository',
  { useClass: FirestoreOrderlineRepository }
)

container.register(
  'OrderlineService',
  { useClass: OrderlineService }
)

container.register(
  'PaymentRepository',
  { useClass: FirestorePaymentRepository }
)

container.register(
  'ProductRepository',
  { useClass: FirestoreProductRepository }
)

container.register(
  'ProductReviewRepository',
  { useClass: FirestoreProductReviewRepository }
)

container.register(
  'ProductFavoriteRepository',
  { useClass: FirestoreProductFavoriteRepository }
)

container.register(
  'ShoppingCartRepository',
  { useClass: FirestoreShoppingCartRepository }
)

container.register(
  'ShoppingCartItemRepository',
  { useClass: FirestoreShoppingCartItemRepository }
)

container.register(
  'ShoppingCartItemService',
  { useClass: ShoppingCartItemService }
)

container.register(
  'StoreRepository',
  { useClass: FirestoreStoreRepository }
)

container.register(
  'StoreReviewRepository',
  { useClass: FirestoreStoreReviewRepository }
)

container.register(
  'StoreFavoriteRepository',
  { useClass: FirestoreStoreFavoriteRepository }
)

container.register(
  'SearchRepository',
  { useClass: FirestoreSearchRepository }
)

container.register(
  'TokenProvider',
  { useClass: GetStreamTokenProvider }
)

export const categoryController = container.resolve(CategoryController)
export const deliveryLocationController = container.resolve(DeliveryLocationController)
export const discountController = container.resolve(DiscountController)
export const orderController = container.resolve(OrderController)
export const orderlineController = container.resolve(OrderlineController)
export const paymentController = container.resolve(PaymentController)
export const productController = container.resolve(ProductController)
export const productReviewController = container.resolve(ProductReviewController)
export const productFavoriteController = container.resolve(ProductFavoriteController)
export const shoppingCartController = container.resolve(ShoppingCartController)
export const shoppingCartItemController = container.resolve(ShoppingCartItemController)
export const storeController = container.resolve(StoreController)
export const storeReviewController = container.resolve(StoreReviewController)
export const storeFavoriteController = container.resolve(StoreFavoriteController)
export const searchController = container.resolve(SearchController)
export const tokenController = container.resolve(TokenController)
export const channelController = container.resolve(ChannelController)
export const userController = container.resolve(UserController)
