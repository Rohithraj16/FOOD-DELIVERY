import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
	console.log("Payment handler running");

	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		street: "",
		city: "",
		state: "",
		zipcode: "",
		country: "",
		phone: "",
	});

	const amount = 500;
	const currency = "INR";
	const receiptId = "receipt_no1";

	const {
		getTotalCartAmount,
		token,
		food_list,
		cartItems,
		url,
		setCartItems,

		deliveryCharge,
	} = useContext(StoreContext);

	const navigate = useNavigate();

	const onChangeHandler = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setData((data) => ({ ...data, [name]: value }));
	};

	const paymentHandler = async (e) => {
		e.preventDefault(); // Prevent form submission
		console.log("Playment handler running");
		const response = await fetch("http://localhost:4000/api/order/order", {
			method: "POST",
			body: JSON.stringify({
				amount,
				currency,
				receipt: receiptId,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const order = await response.json();
		console.log(order);
		var options = {
			key: "rzp_test_uxsR208o8YHnzk",
			amount,
			currency,
			name: "Acme Corp",
			description: "Test Transaction",
			image: "https://example.com/your_logo",
			order_id: order.id,
			handler: async function (response) {
				const body = {
					...response,
				};
				const validateRes = await fetch(
					"http://localhost:4000/api/order/validate",
					{
						method: "POST",
						body: JSON.stringify(body),
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				const jsonRes = await validateRes.json();
				console.log(jsonRes);
			},
			prefill: {
				name: "Integrating the Razorpayin React",
				email: "abcd@example.com",
				contact: "9000900000",
			},
			notes: {
				address: "Razorpay Corporate Office",
			},
			theme: {
				color: "#3399cc",
			},
		};
		var rzp1 = new Razorpay(options);
		rzp1.on("payment.failed", function (response) {
			alert(response.error.code);
			alert(response.error.description);
			alert(response.error.source);
			alert(response.error.step);
			alert(response.error.reason);
			alert(response.error.metadata.order_id);
			alert(response.error.metadata.payment_id);
		});
		rzp1.open();
		e.preventDefault();
	};
	// useEffect(() => {
	// 	if (!token) {
	// 		toast.error("to place an order sign in first");
	// 		navigate("/cart");
	// 	} else if (getTotalCartAmount() === 0) {
	// 		navigate("/cart");
	// 	}
	// }, [token]);

	return (
		<form className="place-order" onSubmit={paymentHandler}>
			<div className="place-order-left">
				<p className="title">Delivery Information</p>
				<div className="multi-field">
					<input
						type="text"
						name="firstName"
						onChange={onChangeHandler}
						value={data.firstName}
						placeholder="First name"
						required
					/>
					<input
						type="text"
						name="lastName"
						onChange={onChangeHandler}
						value={data.lastName}
						placeholder="Last name"
						required
					/>
				</div>
				<input
					type="email"
					name="email"
					onChange={onChangeHandler}
					value={data.email}
					placeholder="Email address"
					required
				/>
				<input
					type="text"
					name="street"
					onChange={onChangeHandler}
					value={data.street}
					placeholder="Street"
					required
				/>
				<div className="multi-field">
					<input
						type="text"
						name="city"
						onChange={onChangeHandler}
						value={data.city}
						placeholder="City"
						required
					/>
					<input
						type="text"
						name="state"
						onChange={onChangeHandler}
						value={data.state}
						placeholder="State"
						required
					/>
				</div>
				<div className="multi-field">
					<input
						type="text"
						name="zipcode"
						onChange={onChangeHandler}
						value={data.zipcode}
						placeholder="Zip code"
						required
					/>
					<input
						type="text"
						name="country"
						onChange={onChangeHandler}
						value={data.country}
						placeholder="Country"
						required
					/>
				</div>
				<input
					type="text"
					name="phone"
					onChange={onChangeHandler}
					value={data.phone}
					placeholder="Phone"
					required
				/>
			</div>
			<div className="place-order-right">
				<div className="cart-total">
					<h2>Cart Totals</h2>
					<div>
						<div className="cart-total-details">
							<p>Subtotal</p>
							<p>
								{currency}
								{getTotalCartAmount()}
							</p>
						</div>
						<hr />
						<div className="cart-total-details">
							<p>Delivery Fee</p>
							<p>
								{currency}
								{getTotalCartAmount() === 0 ? 0 : deliveryCharge}
							</p>
						</div>
						<hr />
						<div className="cart-total-details">
							<b>Total</b>
							<b>
								{currency}
								{getTotalCartAmount() === 0
									? 0
									: getTotalCartAmount() + deliveryCharge}
							</b>
						</div>
						<button type="submit">Proceed To Payment1</button>
					</div>
				</div>
			</div>
		</form>
	);
};

export default PlaceOrder;
