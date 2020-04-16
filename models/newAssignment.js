var mongoose = require('mongoose');

var assignmentSchema = new mongoose.Schema({
	name: String,
	dueDate: String,
	time: {
		hour: Number,
		minute: Number,
		AMPM: String
	},
	description: String,
	student: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			},
			username: String
	}
});

module.exports = mongoose.model("Assignment", assignmentSchema);