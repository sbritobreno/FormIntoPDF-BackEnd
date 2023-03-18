const router = require("express").Router();
const UserController = require("../controllers/UserController");

// middleware
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.patch("/edit", UserController.editUser);
router.delete("/deleteaccount", UserController.deleteUserAccount);
router.delete("/deleteaccount/:id", UserController.deleteUserAccountByAdmin);
router.patch("/toggleuseradmin/:id", UserController.toggleUserIsAdmin);

module.exports = router;
