import mongoose from "mongoose";

const playlistSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});

export default mongoose.model("Playlist", playlistSchema);
