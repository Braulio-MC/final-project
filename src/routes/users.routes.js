import { Router } from "express"
import { 
    checkAccessToken, 
    checkRequiredPermissions 
} from "../middleware/auth0.middleware.js"
import { 
    createUser,
    readUsers,
    readUser,
    updateUser,
    deleteUser,
    readUserPermissions,
    addPermissionsToUser,
    deleteUserPermissions,
    readUserRoles,
    addRolesToUser,
    deleteUserRoles
} from "../controllers/users.controller.js"
import { 
    addPermissionsToUserValidation, 
    deleteUserPermissionsValidation 
} from "../validation/validator.js"

const router = Router()

const usersPermissions = {
    create: "create:users",
    read: "read:users",
    update: "update:users",
    delete: "delete:users",
    readPermissions: "readPermissions:users",
    addPermissions: "addPermissions:users",
    deletePermissions: "deletePermissions:users",
    readRoles: "readRoles:users",
    addRoles: "addRoles:users",
    deleteRoles: "deleteRoles:users"
}

router.post("/users", createUser)
router.get("/users", readUsers)
router.get("/users/:id", readUser)
router.put("/users/:id", updateUser)
router.delete("/users/:id", deleteUser)

// get permissions
router.get("/users/:id/permissions", readUserPermissions)
// assign permissions
router.post("/users/:id/permissions", addPermissionsToUserValidation, addPermissionsToUser)
// delete permissions
router.delete("/users/:id/permissions", deleteUserPermissionsValidation, deleteUserPermissions)

// get roles
router.get("/users/:id/roles", readUserRoles)
// assing roles
router.post("/users/:id/roles", addRolesToUser)
// delete roles
router.delete("/users/:id/roles", deleteUserRoles)

// router.post("/users", checkAccessToken, checkRequiredPermissions([usersPermissions.create]), createUser)
// router.get("/users", checkAccessToken, checkRequiredPermissions([usersPermissions.read]), readUsers)
// router.get("/users/:id", checkAccessToken, checkRequiredPermissions([usersPermissions.read]), readUser)
// router.put("/users/:id", checkAccessToken, checkRequiredPermissions([usersPermissions.update]), updateUser)
// router.delete("/users/:id", checkAccessToken, checkRequiredPermissions([usersPermissions.delete]), deleteUser)

export default router