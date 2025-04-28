import express from "express";
import auth from "../middlewares/auth.js";
import {
  createOrder,
  getcustomerorders,
  orderHistory,
  orderStatus,
  pendingOrders,
} from "../controllers/order.controllers.js";

const router = express.Router();

router.post("/", auth, createOrder);
// Get customer orders
router.get("/customer/:id", auth, getcustomerorders);

router.get("/pending", auth, pendingOrders);
router.put("/:id/status", auth, orderStatus);

router.get("/history/:userId", auth, orderHistory);
export default router;
