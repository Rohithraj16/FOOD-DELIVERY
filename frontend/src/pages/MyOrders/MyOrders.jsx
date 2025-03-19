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
				{ headers: { token } }
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
