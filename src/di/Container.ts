import { container } from 'tsyringe'
import { db } from '../core/FirebaseHelper'
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
import FirestoreProductReviewRepository from '../data/repository/productReview/FirestoreProductReviewRepository'
import ProductReviewController from '../controllers/ProductReview.controller'
import FirestoreProductFavoriteRepository from '../data/repository/productFavorite/FirestoreProductFavoriteRepository'
import ProductFavoriteController from '../controllers/ProductFavorite.controller'
import FirestoreShoppingCartRepository from '../data/repository/shoppingCart/FirestoreShoppingCartRepository'
import ShoppingCartController from '../controllers/ShoppingCart.controller'
import FirestoreStoreRepository from '../data/repository/store/FirestoreStoreRepository'
import StoreController from '../controllers/Store.controller'
import FirestoreStoreReviewRepository from '../data/repository/storeReview/FirestoreStoreReviewRepository'
import StoreReviewController from '../controllers/StoreReview.controller'
import FirestoreStoreFavoriteRepository from '../data/repository/storeFavorite/FirestoreStoreFavoriteRepository'
import StoreFavoriteController from '../controllers/StoreFavorite.controller'
import { algoliaClient, productAlgoliaIndex, storeAlgoliaIndex } from '../core/AlgoliaHelper'
import FirestoreSearchRepository from '../data/repository/search/FirestoreSearchRepository'
import SearchController from '../controllers/Search.controller'

container.register(
  'FirestoreDB',
  { useValue: db }
)

container.register(
  'AlgoliaClient',
  { useValue: algoliaClient }
)

container.register(
  'StoreAlgoliaIndex',
  { useValue: storeAlgoliaIndex }
)

container.register(
  'ProductAlgoliaIndex',
  { useValue: productAlgoliaIndex }
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

export const categoryController = container.resolve(CategoryController)
export const deliveryLocationController = container.resolve(DeliveryLocationController)
export const discountController = container.resolve(DiscountController)
export const orderController = container.resolve(OrderController)
export const paymentController = container.resolve(PaymentController)
export const productController = container.resolve(ProductController)
export const productReviewController = container.resolve(ProductReviewController)
export const productFavoriteController = container.resolve(ProductFavoriteController)
export const shoppingCartController = container.resolve(ShoppingCartController)
export const storeController = container.resolve(StoreController)
export const storeReviewController = container.resolve(StoreReviewController)
export const storeFavoriteController = container.resolve(StoreFavoriteController)
export const searchController = container.resolve(SearchController)
