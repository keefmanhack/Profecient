var mongoose = require('mongoose');

var semesterSchema = new mongoose.Schema({
	name: String,
	student: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	classes: [
		{
			name: String,
			instructor: String,
			location: String
		}
	],
	days: [
		{
			monday: Boolean,
			tuesday: Boolean,
			wednesday: Boolean,
			thursday: Boolean,
			friday: Boolean,
			saturday: Boolean,
			sunday: Boolean
		}
	],
	time: [
		{
			startHour: Number,
			startMinute: Number,
			startAMPM: String,
			endHour: Number,
			endMinute: Number,
			endAMPM: String
		}
	]
});

module.exports = mongoose.model("Semester", semesterSchema);