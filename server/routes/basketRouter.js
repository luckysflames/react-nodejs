const Router = require("express");
const router = new Router();
const basketController = require("../controllers/basketController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, basketController.addToBasket);
router.get("/", authMiddleware, basketController.getBasket);
router.put("/quantity", authMiddleware, basketController.updateQuantity);
router.delete("/remove", authMiddleware, basketController.removeFromBasket);
router.post("/checkout", authMiddleware, basketController.checkout);

module.exports = router;
