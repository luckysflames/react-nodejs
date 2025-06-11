const express = require("express");
const router = express.Router();
const deviceRouter = require("./deviceRouter");
const userRouter = require("./userRouter");
const brandRouter = require("./brandRouter");
const typeRouter = require("./typeRouter");
const orderRouter = require("./orderRouter");
const basketRouter = require("./basketRouter");
const ratingRouter = require("./ratingRouter");

router.use("/user", userRouter);
router.use("/type", typeRouter);
router.use("/brand", brandRouter);
router.use("/device", deviceRouter);
router.use("/order", orderRouter);
router.use("/basket", basketRouter);
router.use("/rating", ratingRouter);

module.exports = router;
