const {Router} = require("express");
const UsersController = require("../controllers/users");
const authValidation = require("../middlewares/authValidation");

const router = Router();
router.use(authValidation({
    requiredRole:"ADMIN"
}));

router.get("/",UsersController.getAllUsers);
router.get("/:id",UsersController.getUser);
router.post("/:id",UsersController.updateUser);
router.post("/delete/:id",UsersController.deleteUser);

module.exports = router;