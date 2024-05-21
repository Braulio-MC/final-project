// import { Router } from 'express'
// // import {
// //   checkAccessToken,
// //   checkRequiredPermissions
// // } from '../middleware/auth0.middleware'
// import {
//   createUser,
//   readUsers,
//   readUser,
//   updateUser,
//   deleteUser,
//   readUserPermissions,
//   addPermissionsToUser,
//   deleteUserPermissions,
//   readUserRoles,
//   addRolesToUser,
//   deleteUserRoles,
// } from '../controllers/user.controller'
// import {
//   usersValidation
// } from '../validation/validator'

// const router = Router()

// router.post('/users', createUser)
// router.get('/users', readUsers)
// router.get('/users/:id', readUser)
// router.put('/users/:id', updateUser)
// router.delete('/users/:id', deleteUser)

// router.get('/users/:id/permissions', readUserPermissions)
// router.post('/users/:id/permissions', usersValidation.addPermissionsToUser, addPermissionsToUser)
// router.delete('/users/:id/permissions', usersValidation.deleteUserPermissions, deleteUserPermissions)

// router.get('/users/:id/roles', readUserRoles)
// router.post('/users/:id/roles', addRolesToUser)
// router.delete('/users/:id/roles', deleteUserRoles)

// // router.post("/users", checkAccessToken, checkRequiredPermissions([usersPermissions.create]), createUser)

// export default router
