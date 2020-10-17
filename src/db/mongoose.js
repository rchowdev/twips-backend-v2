import mongoose from "mongoose";

const connectionUrl = "mongodb://127.0.0.1:27017/twips-backend";

mongoose.connect(connectionUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});
