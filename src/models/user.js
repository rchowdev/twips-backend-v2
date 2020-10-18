import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const validateEmail = (value) => {
	return validator.isEmail(value);
};

const emailValidator = [validateEmail, "Not a valid email."];

const userSchema = mongoose.Schema(
	{
		first_name: {
			type: String,
			required: true,
		},
		last_name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			validate: emailValidator,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ id: false }
);

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

// Adding "playlists" field to user
userSchema.virtual("playlists", {
	ref: "Playlist",
	localField: "_id",
	foreignField: "user",
});

// Remove password and tokens fields from user response
userSchema.methods.toJSON = function () {
	const userObject = this.toObject();

	delete userObject.tokens;
	delete userObject.password;

	return userObject;
};

userSchema.methods.generateAuthToken = async function () {
	// 'this' is bound to document (user instance)

	const token = jwt.sign(
		{ _id: this._id.toString() },
		process.env.JWT_SECRET
	);

	this.tokens = [...this.tokens, { token }];
	await this.save();

	return token;
};

// Find user w/ email and password
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error("Unable to login.");
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error("Unable to login.");
	}

	return user;
};

// Hash password w/ brcrypt before saving
userSchema.pre("save", async function (next) {
	// 'this' is bound to document (user instance) we are saving.

	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 8);
	}

	next();
});

const User = mongoose.model("User", userSchema);

export default User;
