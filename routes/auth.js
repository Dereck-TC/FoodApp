const {Router} = require("express");
const AuthController = require("../controllers/auth");
const router = Router();

router.get("/login",AuthController.getLoginForm);
router.post("/login",AuthController.login);
router.get("/logout",AuthController.logout);

module.exports = router;