import mongoose from "mongoose";

const connectionUrl = process.env.MONGO_DB_URL;

mongoose.connect(connectionUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});
