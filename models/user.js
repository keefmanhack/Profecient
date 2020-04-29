var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	lastName: String,
	firstName: String,
	email: String,

	semester: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Semester"
	}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);