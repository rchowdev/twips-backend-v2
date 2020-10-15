import express from "express";

import User from "../models/user.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
	const user = new User(req.body.user);

	try {
		await user.save();

		const token = await user.generateAuthToken();

		res.status(201).send({ user, token });
	} catch (err) {
		res.status(400).send({ error: err });
	}
});

router.post("/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);

		const token = await user.generateAuthToken();

		res.status(200).send({ user, token });
	} catch (err) {
		res.status(400).send({ error: err });
	}
});

export default router;
