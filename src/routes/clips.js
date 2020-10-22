import express from "express";

import Clip from "../models/clip.js";
import Playlist from "../models/playlist.js";
import authorize from "../middleware/auth.js";

const router = express.Router();

// Get clips from a playlist
router.get("/playlists/:playlist_id/clips", authorize, async (req, res) => {
	try {
		const playlist = await Playlist.findById(req.params.playlist_id);

		if (!playlist) {
			res.status(404).send({ error: "Playlist not found." });
		}

		await playlist
			.populate({
				path: "clips",
				select: "title broadcaster twitch_tr_id thumbnail -playlists",
			})
			.execPopulate();

		res.status(200).send(playlist);
	} catch (err) {
		res.status(500).send(err);
	}
});

// Get clips from a playlist
router.get(
	"/playlists/:playlist_id/clips/:clip_id",
	authorize,
	async (req, res) => {
		try {
			const clip = await Clip.findOne({
				twitch_tr_id: req.params.clip_id,
				playlists: req.params.playlist_id,
			});

			if (!clip) {
				return res.status(200).send({ clipIsInPlaylist: false });
			}

			res.status(200).send({ clipIsInPlaylist: true });
		} catch (err) {
			res.status(500).send(err);
		}
	}
);

// Create and add a clip to playlist
router.post("/playlists/:playlist_id/clips", authorize, async (req, res) => {
	const twitch_tr_id = req.body.clip.twitch_tr_id;
	const playlist_id = req.params.playlist_id;
	// Find an existing clip w/ same twitch id in playlist
	const existingClip = await Clip.findOne({
		twitch_tr_id,
		playlists: { $in: playlist_id },
	});

	// If there is a clip w/ same twitch id in playlist, don't
	// create new clip
	if (existingClip) {
		return res.status(200).send("Clip is already in playlist.");
	}

	// clip.playlists.push(req.params.playlist_id);

	try {
		const clip = await Clip.findOneAndUpdate(
			req.body.clip,
			{ $push: { playlists: playlist_id } },
			{
				upsert: true,
				new: true,
			}
		);

		res.status(201).send(clip);
	} catch (err) {
		res.status(400).send({ error: err.message });
	}
});

// Delete a clip from playlist
router.delete(
	"/playlists/:playlist_id/clips/:clip_id",
	authorize,
	async (req, res) => {
		try {
			const clip = await Clip.findOneAndUpdate(
				{ twitch_tr_id: req.params.clip_id },
				{
					$pull: { playlists: req.params.playlist_id },
				},
				{ new: true }
			);

			res.status(200).send(clip);
		} catch (err) {
			res.status(500).send({ error: err.message });
		}
	}
);
export default router;
