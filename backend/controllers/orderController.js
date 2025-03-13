import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

import Razorpay from "razorpay";

//config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = "http://localhost:5173";

const placeOrderRazorPay = async (req, res) => {
	try {
		const razorpay = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_SECRET,
		});
		const options = req.body;
		const order = await razorpay.orders.create(options);
		if (!order) {
			return res.status(500).send("Error");
		}
		res.json(order);
	} catch (err) {
		console.error("Razorpay Order Error:", err);
		res.status(500).json({ error: err.message });
	}
};

// Placing User Order for Frontend using stripe
const placeOrderCod = async (req, res) => {
	try {
		const newOrder = new orderModel({
			userId: req.body.userId,
			items: req.body.items,
			amount: req.body.amount,
			address: req.body.address,
			payment: true,
		});
		await newOrder.save();
		await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

		res.json({ success: true, message: "Order Placed" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: "Error" });
	}
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
	try {
		const orders = await orderModel.find({});
		res.json({ success: true, data: orders });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: "Error" });
	}
};

const validateRes = async (req, res) => {
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
		req.body;
	const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
	sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
	const digest = sha.digest("hex");
	if (digest !== razorpay_signature) {
		return res.status(400).json({ msg: "Transaction is not legit" });
	}
	const responseData = {
		msg: "success",
		order_Id: razorpay_order_id,
		payment_Id: razorpay_payment_id,
	};
	console.log("Sending response:", responseData);

	res.json(responseData);
};

// User Orders for Frontend
const userOrders = async (req, res) => {
	try {
		const orders = await orderModel.find({ userId: req.body.userId });
		res.json({ success: true, data: orders });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: "Error" });
	}
};
// api for updating order status
const updateStatus = async (req, res) => {
	//console.log(req.body);
	try {
		await orderModel.findByIdAndUpdate(req.body.orderId, {
			status: req.body.status,
		});
		res.json({ success: true, message: "Status Updated" });
	} catch (error) {
		res.json({ success: false, message: "Error" });
	}
};

const verifyOrder = async (req, res) => {
	const { orderId, success } = req.body;
	try {
		if (success === "true") {
			await orderModel.findByIdAndUpdate(orderId, { payment: true });
			res.json({ success: true, message: "Paid" });
		} else {
			await orderModel.findByIdAndDelete(orderId);
			res.json({ success: false, message: "Not Paid" });
		}
	} catch (error) {
		res.json({ success: false, message: "Not  Verified" });
	}
};

export {
	listOrders,
	userOrders,
	updateStatus,
	verifyOrder,
	placeOrderCod,
	placeOrderRazorPay,
	validateRes,
};
