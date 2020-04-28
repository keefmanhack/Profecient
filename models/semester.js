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
	classes: [{ 
		type: mongoose.Schema.Types.ObjectId,
		ref: "Class"
	}]
});

module.exports = mongoose.model("Semester", semesterSchema);