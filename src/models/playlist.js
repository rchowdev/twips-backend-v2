import mongoose from "mongoose";
import Clip from "./clip.js";

const playlistSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			required: true,
			ref: "User",
		},
	},
	{ id: false }
);

playlistSchema.set("toJSON", { virtuals: true });

// Adding "clips" field to user
playlistSchema.virtual("clips", {
	ref: "Clip",
	localField: "_id",
	foreignField: "playlists",
});

// Delete playlist id from clip's playlists field
playlistSchema.pre("findOneAndDelete", async function (next) {
	// 'this' refers to Query object returned from findOneAndDelete

	// Access the query arguments passed in to get id
	const playlist_id = this.getFilter()["_id"];

	const res = await Clip.updateMany(
		{ playlists: playlist_id },
		{ $pull: { playlists: playlist_id } }
	);

	next();
});

export default mongoose.model("Playlist", playlistSchema);
