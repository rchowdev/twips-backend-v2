import express from "express";

import Clip from "../models/clip.js";
import authorize from "../middleware/auth.js";

const router = express.Router();

router.post("/", authorize, async (req, res) => {
	const clip = new Clip(req.body.clip);

	try {
		await clip.save();
		res.status(201).send(clip);
	} catch (err) {
		res.status(400).send({ error: err });
	}
});

export default router;
