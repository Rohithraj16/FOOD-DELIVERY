import React, { useState } from "react";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu.jsx";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay.jsx";
import AppDownload from "../../components/AppDowload/AppDownload.jsx";

const Home = () => {
	const [category, setCategory] = useState("All");

	return (
		<>
			<Header />
			<ExploreMenu setCategory={setCategory} category={category} />
			<FoodDisplay category={category} />
			<AppDownload />
		</>
	);
};

export default Home;
