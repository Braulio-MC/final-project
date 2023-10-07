import { Router } from "express"
import {
    checkAccessToken,
    checkRequiredPermissions
} from "../middleware/auth0.middleware.js"
import {
    createRole,
    readRoles,
    readRole,
    updateRole,
    deleteRole,
    addPermissionsToRole,
    readRolePermissions,
    deleteRolePermissions,
    readRoleUsers
} from "../controllers/roles.controller.js"

const router = Router()

const rolesPermissions = {
    create: "create:roles",
    read: "read:roles",
    update: "update:roles",
    delete: "delete:roles",
    addPermissions: "addPermissions:roles",
    readPermissions: "readPermissions:roles",
    deletePermissions: "deletePermissions:roles",
    readUsers: "readUsers:roles"
}

router.post("/roles", createRole)
router.get("/roles", readRoles)
router.get("/roles/:id", readRole)
router.put("/roles/:id", updateRole)
router.delete("/roles/:id", deleteRole)

// add permissions
router.post("/roles/:id/permissions", addPermissionsToRole)
// get permissions
router.get("/roles/:id/permissions", readRolePermissions)
// delete permissions
router.delete("/roles/:id/permissions", deleteRolePermissions)

// get users
router.get("/roles/:id/users", readRoleUsers)

// router.post("/roles", checkAccessToken, checkRequiredPermissions([rolesPermissions.create]), createRole)
// router.get("/roles", checkAccessToken, checkRequiredPermissions([rolesPermissions.read]), readRoles)
// router.get("/roles/:id", checkAccessToken, checkRequiredPermissions([rolesPermissions.read]), readRole)
// router.put("/roles/:id", checkAccessToken, checkRequiredPermissions([rolesPermissions.update]), updateRole)
// router.delete("/roles/:id", checkAccessToken, checkRequiredPermissions([rolesPermissions.delete]), deleteRole)

// // add permissions
// router.post("/roles/:id/permissions", checkAccessToken, checkRequiredPermissions([rolesPermissions.addPermissions]), addPermissionsToRole)
// // get permissions
// router.get("/roles/:id/permissions", checkAccessToken, checkRequiredPermissions([rolesPermissions.readPermissions]), readRolePermissions)
// // delete permissions
// router.delete("/roles/:id/permissions", checkAccessToken, checkRequiredPermissions([rolesPermissions.deletePermissions]), deleteRolePermissions)

// // add users
// router.post("/roles/:id/users", checkAccessToken, checkRequiredPermissions([rolesPermissions.addUsers]), addUsersToRole)
// // get users
// router.get("/roles/:id/users", checkAccessToken, checkRequiredPermissions([rolesPermissions.readUsers]), readRoleUsers)

export default router