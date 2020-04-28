var mongoose = require('mongoose');

var classSchema = new mongoose.Schema({
	name: String,
	instructor: String,
	location: String,
	days: 
		{
		monday: Boolean,
		tuesday: Boolean,
		wednesday: Boolean,
		thursday: Boolean,
		friday: Boolean,
		saturday: Boolean,
		sunday: Boolean
		},
		time:
		{
			startHour: String,
			startMinute: String,
			startAMPM: String,
			endHour: String,
			endMinute: String,
			endAMPM: String
		},
		assignments: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Assignment"
		}]
});

module.exports = mongoose.model("Class", classSchema);