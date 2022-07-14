const {Router} = require("express");
const FoodController = require("../controllers/food");
const authValidation = require("../middlewares/authValidation");

const router = Router();
// router.use(authValidation({
//     requiredRole:"ADMIN",
//     excent:["/"]
// }));

router.get("/",FoodController.getAll);
router.get("/addFood",FoodController.getAddForm);
router.post("/addFood",FoodController.add);
router.get("/edit/:id",FoodController.getEditForm);
router.post("/edit/:id", FoodController.edit);
router.get("/delete/:id", FoodController.delete);


module.exports = router;