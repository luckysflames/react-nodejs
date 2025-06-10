const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.get("/analytics", orderController.getAnalytics);
router.get("/export", orderController.exportOrders);
router.get("/no-orders", orderController.getNoOrderPeriods);
router.get("/peak-period", orderController.getPeakOrderPeriod);

module.exports = router;
