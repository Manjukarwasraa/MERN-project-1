const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
      required: true,
      minLength: 2,
      trim: true
    },
		email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      toLowercase: true
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    }

	}, {timestamps:true}
);

const User = new mongoose.model("user", userSchema);
module.exports = User;

	

  