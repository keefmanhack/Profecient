var express = require("express"),
	router = express.Router(),
	middleWare	= require("../middleware/");

var Semester = require("../models/semester");

var weekDays = ['Mon.', 'Tues.', 'Wed.', 'Thurs.', 'Fri.', 'Sat.', 'Sun.'];
router.get("/home", middleWare.isLoggedIn, function(req, res){

	Semester.find({})
		.populate({
			path: 'classes.assignments'
		})
		.exec(function(err, allSemesters){
			if(err){
				console.log(err);
			}else{
				res.render("index/home", {semesters: allSemesters, weekDays: weekDays});
			}
	});
});

router.get("/newsemester", middleWare.isLoggedIn, function(req, res){
	res.render("semester/newsemester");
});

router.post("/newsemester", middleWare.isLoggedIn, function(req, res){

	
	var semesterID;
	var newSemester = {
		name: req.body.semesterName,
		student: {
			id: req.user._id,
			username: req.user.username
		},
		classes: createClasses(req.body)
	};

	Semester.create(newSemester, function(err, newlyCreatedSemester){
			if(err){
				console.log(err);
			}else{
				res.redirect("/home");
			}
		});
});

//cRud Classes

router.get("/class/:id", middleWare.isLoggedIn, function(req, res){
	Semester.findOne({'classes._id': req.params.id})
		.populate({
			path: 'classes.assignments'
		})
		.exec(function(err, foundSemester){
			if(err){
				console.log(err);
				res.redirect("back");
			}else{
				foundSemester.classes.forEach(function(queryClass){
					if(queryClass._id == req.params.id){
						var currentDate = new Date();

						var dateBreakout = {
							day: currentDate.getDate(),
							month: currentDate.getMonth() + 1,
							year: currentDate.getFullYear()
						}

						queryClass.assignments.forEach(function(assignment){
							var splitDueDate = assignment.dueDate.split("/");

							const assignmentDueDate = {
								day: parseInt(splitDueDate[1], 10),
								month: parseInt(splitDueDate[0], 10),
								year: parseInt(splitDueDate[2], 10) 
							}

							

							assignment.due.overdue = false;
							assignment.due.today = false;
							assignment.due.tomorrow = false;
							assignment.due.thisweek = false;
							assignment.due.upcomming = false;


							if((assignmentDueDate.day < dateBreakout.day) && (assignmentDueDate.month <= dateBreakout.month) && (assignmentDueDate.year <= dateBreakout.year)){
								assignment.due.overdue = true;
							}else if((assignmentDueDate.day === dateBreakout.day) && (assignmentDueDate.month === dateBreakout.month) && (assignmentDueDate.year === dateBreakout.year)){
								assignment.due.today = true;
							}else if ((assignmentDueDate.day === (dateBreakout.day+1)) && (assignmentDueDate.month === dateBreakout.month) && (assignmentDueDate.year === dateBreakout.year)){
								assignment.due.tomorrow = true;
							}else if(((assignmentDueDate.day - dateBreakout.day) < 8) && ((assignmentDueDate.day - dateBreakout.day) >= 2) && (assignmentDueDate.month === dateBreakout.month) && (assignmentDueDate.year === dateBreakout.year)){
								assignment.due.thisWeek = true;
							}else{
								assignment.due.upcomming = true;
							}

							assignment.save();




						});


						res.render("semester/showClass", {classData: queryClass, weekDays: weekDays});
					}
				});
			}
		});
});

//crUd Classes  ****Add checkauthorization
router.get("/semester/:id/update", middleWare.isLoggedIn, function(req, res){
	Semester.findOne({'classes._id': req.params.id}, function(err, foundSemester){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.render("semester/updateClass", {semesterData: foundSemester, weekDays: weekDays});
		}
	});
});

router.put("/semester/:id", function(req, res){
	var updatedSemester = {
		name: req.body.semesterName,
		student: {
			id: req.user._id,
			username: req.user.username
		},
		classes: createClasses(req.body)
	};

	Semester.findByIdAndUpdate(req.params.id, updatedSemester, function(err, foundSemester){
		if(err){
			console.log(err);
		}else{
			
			res.redirect("/home");
		}
	});
});


//cruDClasses
router.delete("/semester/:id", middleWare.isLoggedIn, function(req, res){
	Semester.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/home");
		}
	});
});

function createClasses(body){
	var classes = [];
	var newClass = {};
	if(Array.isArray(body.class.name)){
		for(var i =0; i < body.class.name.length; i++){
			newClass =
				{
					name: body.class.name[i],
					instructor: body.class.instructor[i],
					location: body.class.location[i],
					days : createWeek(body.class, i),
					time: createTime(body.class, i)
				};
			classes.push(newClass);
		}
		return classes;
	}else{
		return body.class;
	}
}

function createWeek(body, i){
	newWeek =
	{
		monday: body.days.monday[i],
		tuesday: body.days.tuesday[i],
		wednesday: body.days.wednesday[i],
		thursday: body.days.thursday[i],
		friday: body.days.friday[i],
		saturday: body.days.saturday[i],
		sunday: body.days.sunday[i]

	};
	return newWeek;
}

function createTime(body, i){
	newTime =
		{
		startHour: body.time.startHour[i],
		startMinute: body.time.startMinute[i],
		startAMPM: body.time.startAMPM[i],
		endHour: body.time.endHour[i],
		endMinute: body.time.endMinute[i],
		endAMPM: body.time.endAMPM[i]
		};
	return newTime;
}

module.exports = router;