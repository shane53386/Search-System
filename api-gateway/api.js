const express = require("express");
const cors = require("cors");
const app = express();
const db = require("../json-server/db");

const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true,
};

app.use(cors(corsOptions));

app.get("/trips", (req, res) => {
	const keyword = req.query.keyword;
	res.json(
		db.trips.filter(
			(trip) =>
				trip.title.includes(keyword) ||
				trip.description.includes(keyword) ||
				trip.tags.includes(keyword)
		)
	);
	res.status(200);
});

app.listen(9000, () => console.log("Server running on port 9000"));
