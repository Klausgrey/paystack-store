const express = require("express");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv/config");
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

const app = express();
app.use(express.json());

const User = require("./models/user");
const Products = require("./models/products");
const Orders = require("./models/orders");
const verifyToken = require("./middleware/auth");
const { default: axios } = require("axios");

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err));

app.post("/register", async (req, res) => {
	const { username, email, password } = req.body;

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		await User.create({ username, email, password: hashedPassword });
		res.json({ message: "Created" });
	} catch (err) {
		res.json({ err });
	}
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.json({ message: "No user found" });
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			res.json({ message: "Wrong password" });
		}
		const token = jsonWebToken.sign(
			{ id: user.id, username: user.username, email: user.email },
			JWT_SECRET,
		);
		res.json({ token });
	} catch (err) {
		res.json({ err });
	}
});

app.post("/products", verifyToken, async (req, res) => {
	const { name, price, description } = req.body;

	try {
		await Products.create({ name, price, description });
		res.json({ message: "Product created" });
	} catch (err) {
		res.json({ err });
	}
});

app.get("/products", async (req, res) => {
	try {
		const result = await Products.find();
		res.json({ result });
	} catch (err) {
		res.json({ err });
	}
});

app.post("/orders/:productId", verifyToken, async (req, res) => {
	console.log("order route hit");
	const productId = req.params.productId;
	const userId = req.user.id;

	try {
		const check = await Products.findById(productId);
		if (!check) {
			return res.json(404);
		}
		const productPrice = check.price;

		await Orders.create({ userId, productId, amount: productPrice });
		const response = await axios.post(
			"https://api.paystack.co/transaction/initialize",
			{ email: req.user.email, amount: productPrice * 100 },
			{ headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } },
		);
		const reference = response.data.data.reference;
		await Orders.findOneAndUpdate({ userId, productId }, { reference });
	} catch (err) {
		res.json({ err });
	}
});

app.post("/webhook/paystack", async (req, res) => {
	const reference = req.body.data.reference;


	try {
		if (req.body.event === "charge.success") {
			await Orders.findOneAndUpdate({ reference }, { status: "paid" });
			return res.sendStatus(200)
		}
	} catch (err) {
		res.json({ err });
	}
});

app.listen(3000);
