import express from "express";
import authorize from "../middleware/auth.js";

import Playlist from "../models/playlist.js";

const router = express.Router();

// Create new playlist
router.post("/", authorize, async (req, res) => {
	const playlist = new Playlist(req.body.playlist);

	try {
		await playlist.save();
		res.status(201).send(playlist);
	} catch (err) {
		res.status(400).send({ error: err });
	}
});

// Update playlist
router.patch("/:id", authorize, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ["name"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		res.status(400).send({ error: "Invalid Update Operation." });
	}

	try {
		const playlist = await Playlist.findById(req.params.id);

		for (let update of updates) {
			playlist[update] = req.body[update];
		}

		await playlist.save();
	} catch (err) {
		res.send(400).send({ error: err });
	}
});
export default router;
