const express = require("express")
const bcrypt = require("bcrypt");
const jsonWebToken= require("jsonwebtoken")
const mongoose = require("mongoose")
require("dotenv/config");
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;


const User = require("./models/user");
const Products = require("./models/products");
const Orders = require("./models/orders");
const verifyToken = require("./middleware/auth");

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err));



const app = express()
app.use(express.json())


app.listen(3000)