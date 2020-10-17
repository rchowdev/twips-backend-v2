import jwt from "jsonwebtoken";

import User from "../models/user.js";

// Middleware to handle authorization for endpoints
const authorize = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = jwt.verify(token, "jwt_s3cr3t");
		const user = await User.findOne({
			_id: decoded._id,
			"tokens.token": token,
		});

		if (!user) {
			throw new Error();
		}

		req.user = user;
		req.token = token;
		next();
	} catch (err) {
		res.status(401).send({ error: "Please login" });
	}
};

export default authorize;
