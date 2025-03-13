import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
	listOrders,
	updateStatus,
	userOrders,
	verifyOrder,
	placeOrderCod,
	placeOrderRazorPay,
	validateRes,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/list", listOrders);
orderRouter.post("/userorders", authMiddleware, userOrders);

orderRouter.post("/status", updateStatus);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/placecod", authMiddleware, placeOrderCod);
orderRouter.post("/order", authMiddleware, placeOrderRazorPay);
orderRouter.post("/validate", authMiddleware, validateRes);

export default orderRouter;
