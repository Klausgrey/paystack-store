const jsonWebToken = require("jsonwebtoken");
require("dotenv/config");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
	const auth = req.headers.authorization;

	if (!auth) {
		return res.json({ message: "Token not found" });
	}
	const token = auth.split(" ")[1];
	if (!token) {
		return res.json({ message: "Token not found" });
	}

	try {
		const decoded = jsonWebToken.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		res.json({ err });
	}
};

module.exports = verifyToken