import mongoose from "mongoose";

const clipSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	broadcaster: {
		type: String,
		required: true,
	},
	thumbnail: {
		type: String,
		required: true,
	},
	twitch_tr_id: {
		type: String,
		required: true,
	},
	embed_url: {
		type: String,
		required: true,
	},
	playlists: {
		type: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: "Playlist",
			},
		],
	},
});

clipSchema.methods.toJSON = function () {
	const clipObj = this.toObject();
	delete clipObj.playlists;

	return clipObj;
};

// If playlists field is empty after updating clip,
// delete the clip
clipSchema.post("findOneAndUpdate", async function (doc) {
	if (doc.playlists.length === 0) {
		doc.remove();
	}
});

const Clip = mongoose.model("Clip", clipSchema);

export default Clip;
