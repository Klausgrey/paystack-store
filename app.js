const express = require("express");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv/config");
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(express.json());

const User = require("./models/user");
const Products = require("./models/products");
const Orders = require("./models/orders");
const verifyToken = require("./middleware/auth");

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err));

app.post("/register", async (req, res) => {
	const { username, password } = req.body;

	hashedPassword = await bcrypt.hash(password, 10);

	try {
		await User.create({ username, password: hashedPassword });
		res.json({ message: "Created" });
	} catch (err) {
		res.json({ err });
	}
});

app.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findById({ username });
		if (!user) {
			return res.json({ message: "No user found" });
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			res.json({ message: "Wrong password" });
		}
		const token = jsonWebToken.sign(
			{ id: user.id, username: user.username },
			JWT_SECRET,
		);
		res.json({ token });
	} catch (err) {
		res.json({ err });
	}
});



app.listen(3000);
