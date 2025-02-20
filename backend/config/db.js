import mongoose from "mongoose";

export const connectDB = async () => {
	await mongoose
		.connect(
			"mongodb+srv://rohithraj08:Rohith*123@cluster0.g0j3j.mongodb.net/food-delivery"
		)
		.then(() => console.log("db successfully connected"));
};
