const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
	amount: { type: Number, required: true },
	status: { type: String, enum: ["pending", "paid"], default: "pending" },
	reference: {type: String},
});

const Orders = mongoose.model("Orders", orderSchema);

module.exports = Orders;
