import express from "express";

import User from "../models/user.js";
import authorize from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
	const user = new User(req.body.user);

	try {
		await user.save();

		const token = await user.generateAuthToken();

		res.status(201).send({ user, token });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);

		const token = await user.generateAuthToken();

		await user
			.populate({ path: "playlists", select: "name" })
			.execPopulate();

		res.status(200).send({ user, token });
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});

router.post("/logout", authorize, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});

		await req.user.save();
		res.status(200).send();
	} catch (err) {
		res.status(500).send({ error: "Logout failed" });
	}
});

router.post("/logoutAll", authorize, async (req, res) => {
	try {
		req.user.tokens = [];

		await req.user.save();
		res.status(200).send();
	} catch (err) {
		res.status(500).send({ error: "Logout failed" });
	}
});

export default router;
