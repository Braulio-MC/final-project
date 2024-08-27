// import server from './app'
// import { appConfig } from './core/Configuration'

import { recursiveCollectionDelete as rcdFunc } from './functions/RecursiveCollectionDelete'
import { uploadImage as uplIFunc } from './functions/UploadImage'
import { updateImage as updIFunc } from './functions/UpdateImage'
import * as categoryFuncs from './functions/Category.functions'
import * as discountFuncs from './functions/Discount.functions'
import * as locationFuncs from './functions/Location.functions'
import * as productFuncs from './functions/Product.functions'
import * as pushNotificationFuncs from './functions/PushNotification.functions'
import * as messagingFuncs from './functions/Messaging.functions'

export const recursiveCollectionDelete = rcdFunc
export const uploadImage = uplIFunc
export const updateImage = updIFunc
export const category = categoryFuncs
export const discount = discountFuncs
export const location = locationFuncs
export const product = productFuncs
export const pushNotification = pushNotificationFuncs
export const messaging = messagingFuncs

// function main (): void {
//   try {
//     server.listen(appConfig.develPort)
//   } catch (error) {
//     console.error(error) // development purposes
//   }
// }

// main()
