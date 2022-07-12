const {Router} = require("express");
const FoodController = require("../controllers/food");
const authValidation = require("../middlewares/authValidation");

const router = Router();

router.get("/",FoodController.getAll);
router.get("/addFood",FoodController.getAddForm);

module.exports = router;