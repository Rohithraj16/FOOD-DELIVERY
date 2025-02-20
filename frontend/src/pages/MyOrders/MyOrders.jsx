// import React, { useEffect, useState } from "react";
// import "./Myorders.css";
// import { useContext } from "react";
// import { StoreContext } from "../../Context/StoreContext";
// import axios from "axios";
// import { assets } from "../../assets/assets";
// function MyOrders() {
// 	const { url, token } = useContext(StoreContext);
// 	const [data, setData] = useState([]);

// 	const fetchOrders = async () => {
// 		const response = await axios.post(
// 			url + "/api/order/myorders",
// 			{},
// 			{ header: token }
// 		);
// 		setData(response.data.data);
// 	};
// 	useEffect(() => {
// 		if (token) {
// 			fetchOrders();
// 		}
// 	}, [token]);

// 	return (
// 		<div className="my-orders">
// 			<h2>My Orders</h2>
// 			<div className="container">
// 				{data.map((order, index) => {
// 					return (
// 						<div key={index} className="my-orders-order">
// 							<img src={assets.parcel_icon} alt="" />
// 							<p>
// 								{order.items.map((item, index) => {
// 									if (index === order.items.length - 1) {
// 										return item.name + "x" + item.quantity;
// 									} else {
// 										return item.name + "x" + item.quantity + ",";
// 									}
// 								})}
// 							</p>
// 							<p>${order.amount}.00</p>
// 							<p>Items:{order.item.length}</p>
// 							<p>
// 								<span>
// 									&#x25cf; <b>{order.status}</b>
// 								</span>
// 							</p>
// 							<button onClick={fetchOrders}>Track order</button>
// 						</div>
// 					);
// 				})}
// 			</div>
// 		</div>
// 	);
// }

// export default MyOrders;
import React, { useEffect, useState, useContext } from "react";
import "./Myorders.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

function MyOrders() {
	const { url, token } = useContext(StoreContext);
	const [data, setData] = useState([]);

	const fetchOrders = async () => {
		try {
			const response = await axios.post(
				url + "/api/order/myorders",
				{},
				{ headers: { token } } // ✅ Corrected
			);
			setData(response.data.data);
		} catch (error) {
			console.error("Error fetching orders:", error);
		}
	};

	useEffect(() => {
		if (token) {
			fetchOrders();
		}
	}, [token]);

	return (
		<div className="my-orders">
			<h2>My Orders</h2>
			<div className="container">
				{data.map((order, index) => (
					<div key={index} className="my-orders-order">
						<img src={assets.parcel_icon} alt="Parcel Icon" />
						<p>
							{order.items
								.map((item) => `${item.name} x${item.quantity}`)
								.join(", ")}
						</p>
						<p>${order.amount}.00</p>
						<p>Items: {order.items.length}</p>
						<p>
							<span>
								&#x25cf; <b>{order.status}</b>
							</span>
						</p>
						<button onClick={fetchOrders}>Track order</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default MyOrders;
