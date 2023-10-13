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
} from "../controllers/role.controller.js"

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

router.post("/roles/:id/permissions", addPermissionsToRole)
router.get("/roles/:id/permissions", readRolePermissions)
router.delete("/roles/:id/permissions", deleteRolePermissions)

router.get("/roles/:id/users", readRoleUsers)

// router.post("/roles", checkAccessToken, checkRequiredPermissions([rolesPermissions.create]), createRole)

export default router