const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
	{
		userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
		title:{
			type: String,
			required: true,
			minlength: 10,
			discription: "Title of the session"
		},
		description:{
			type: String,
			required: true,
			minlength: 10,
		},
		category:{
			type: String,
			required: true
		},
		mentor:{
			type: String,
			required: true
		},
		date:{
			type: Date,
			required: true
		},
		students:[
			{
				type: mongoose.Schema.Types.ObjectId,
			  ref: "user"
		  }
		],
		status:{
			type:String,
			default: "scheduled",
			enum: ["scheduled", "completed", "cancelled"]
		}
	},
	{timestamps:true}
);

const Session =  mongoose.model("session", sessionSchema);
module.exports = Session;