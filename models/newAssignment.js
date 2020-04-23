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
	},
	due: {
		overdue: {type: Boolean, default: false},
		today: {type: Boolean, default: false},
		tomorrow: {type: Boolean, default: false},
		thisWeek: {type: Boolean, default: false},
		upcomming: {type: Boolean, default: false}
	}
});

module.exports = mongoose.model("Assignment", assignmentSchema);