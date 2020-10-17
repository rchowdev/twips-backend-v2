import express from "express";
import authorize from "../middleware/auth.js";

import Playlist from "../models/playlist.js";

const router = express.Router();

// Get all of user's playlists
router.get("/", authorize, async (req, res) => {
	try {
		// const playlists = await Playlist.find({ user: req.user._id });
		await req.user.populate("playlists").execPopulate();
		const playlists = req.user.playlists;

		res.status(200).send(playlists);
	} catch (err) {
		res.status(400).send({ error: err });
	}
});

// Create new playlist for user
router.post("/", authorize, async (req, res) => {
	const playlist = new Playlist({
		...req.body.playlist,
		user: req.user._id,
	});

	try {
		await playlist.save();
		res.status(201).send(playlist);
	} catch (err) {
		console.log(err);
		res.status(400).send({ error: err.message });
	}
});

// Update user's playlist
router.patch("/:id", authorize, async (req, res) => {
	const updates = Object.keys(req.body.playlist);
	const allowedUpdates = ["name"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		res.status(400).send({ error: "Invalid Update Operation." });
	}

	try {
		const playlist = await Playlist.findOne({
			_id: req.params.id,
			user: req.user._id,
		});

		if (!playlist) {
			return res.status(404).send({ error: "Playlist not found." });
		}

		for (let update of updates) {
			playlist[update] = req.body.playlist[update];
		}

		await playlist.save();

		res.status(200).send(playlist);
	} catch (err) {
		res.status(500).send({ error: err });
	}
});

// Delete user's playlist
router.delete("/:id", authorize, async (req, res) => {
	try {
		const playlist = await Playlist.findOneAndDelete({
			_id: req.params.id,
			user: req.user._id,
		});

		if (!playlist) {
			return res.status(404).send("Playlist not found.");
		}

		res.status(200).send(playlist);
	} catch (err) {
		res.status(500).send({ error: err.message });
	}
});
export default router;
