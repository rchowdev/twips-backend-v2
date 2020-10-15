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
});

export default mongoose.model("Clip", clipSchema);
