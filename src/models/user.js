import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const validateEmail = (value) => {
	return validator.isEmail(value);
};

const emailValidator = [validateEmail, "Not a valid email."];

const userSchema = mongoose.Schema({
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
});

userSchema.methods.generateAuthToken = async function () {
	// 'this' is bound to document (user instance)

	const token = jwt.sign({ _id: this._id.toString() }, "jwt_s3cr3t");

	this.tokens = [...this.tokens, { token }];
	await this.save();

	return token;
};

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

// Hash password w/ brcrypt
userSchema.pre("save", async function (next) {
	// 'this' is bound to document (user instance) we are saving.

	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 8);
	}

	next();
});

const User = mongoose.model("User", userSchema);

export default User;
