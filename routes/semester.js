var express = require("express"),
	router = express.Router(),
	middleWare	= require("../middleware/");

var Semester = require("../models/semester");
var Classes = require("../models/class");
var Assignments = require("../models/assignment");

var weekDays = ['Mon.', 'Tues.', 'Wed.', 'Thurs.', 'Fri.', 'Sat.', 'Sun.'];

router.get("/calendar", middleWare.isLoggedIn, function(req, res){
	res.render("index/calendar");
});

router.get("/dashboard", middleWare.isLoggedIn, function(req, res){
	// Semester.findOne({}, function(err, foundSemester){
	// 	if(!Object.keys(foundSemester.classes).length){
	// 		Classes.find({}, function(err, allClasses){
	// 			allClasses.forEach(function(o){
	// 				foundSemester.classes.push(o);
	// 			});
		
	// 			foundSemester.save();
	// 			foundSemester.populate({path: 'classes', populate: {path: 'assignments'}});
	// 		});
	// 	}
	// });

	Semester.findOne({}).populate({path: 'classes', populate: {path: 'assignments'}}).exec(function(err, foundSemester){
			if(err){
				console.log(err);
			}else{
				res.render("index/dashboard", {semesters: foundSemester, weekDays: weekDays});
			}
	});
});

router.get("/classes", middleWare.isLoggedIn, function(req, res){
	Semester.find({}, function(err, allSemesters){
		if(err){
			console.log(err);
		}else{
			res.render("index/classes", {semesters: allSemesters, weekDays: weekDays});
		}
	})
})

router.get("/newsemester", middleWare.isLoggedIn, function(req, res){
	res.render("semester/newsemester");
});

router.post("/newsemester", middleWare.isLoggedIn, function(req, res){
	Semester.remove({}, function(err){
		if(err){
			console.log(err);
		}
	});

	Classes.remove({}, function(err){
		if(err){
			console.log(err);
		}
	});

	Assignments.remove({}, function(err){
		if(err){
			console.log(err);
		}
	});
	
	var newSemester = {
		name: req.body.semesterName,
		student: {
			id: req.user._id,
			username: req.user.username
		}
	};
	

	var temp =[];

	Classes.create(createClasses(req.body), function(err, newClasses){
		if(err){
			console.log(err);
		}else{
			//newClasses.save();
			Semester.create(newSemester, function(err, newlyCreatedSemester){
				if(err){
					console.log(err);
				}else{
					newClasses.forEach(function(o){
						newlyCreatedSemester.classes.push(o);
					})
					newlyCreatedSemester.save();
					console.log(newlyCreatedSemester);
					res.redirect('/dashboard');
				}
	});
		}
	});



	


});

//cRud Classes
router.get("/class/:id", middleWare.isLoggedIn, function(req, res){
	Classes.findById(req.params.id).populate({path: 'assignments'}).exec(function(err, foundClass){
			if(err){
				console.log(err);
				res.redirect("back");
			}else{	
				var currentDate = new Date();

				var dateBreakout = {
					day: currentDate.getDate(),
					month: currentDate.getMonth() + 1,
					year: currentDate.getFullYear()
				}

				foundClass.assignments.forEach(function(assignment){
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
				res.render("semester/showClass", {classData: foundClass, weekDays: weekDays});
			}
		});
});

//crUd Classes  ****Add checkauthorization
router.get("/semester/:id/update", middleWare.isLoggedIn, function(req, res){
	Semester.findById(req.params.id).populate('classes').exec(function(err, foundSemester){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.render("semester/update_semester", {semesterData: foundSemester, weekDays: weekDays});
		}
	});
});

router.put("/semester/:id", middleWare.isLoggedIn, function(req, res){
	var updatedSemester = {
		name: req.body.semesterName,
		student: {
			id: req.user._id,
			username: req.user.username
		}
	};



	Semester.findByIdAndUpdate(req.params.id, updatedSemester, function(err, foundSemester){
		if(err){
			console.log(err);
		}
	});

	var ct =0;
	var newClassData = createClasses(req.body); 
	Classes.find({}, function(err, foundClasses){
		if(err){
			console.log(err);
			res.redirect('/dashboard');
		}else{
			foundClasses.forEach(function(o){
				Classes.findByIdAndUpdate(o._id, newClassData[ct], function(err, foundClass){
					if(err){
						console.log(err);
					}
				});
				ct++;
			});
		res.redirect('/dashboard');
		}
	})
});


//cruDClasses
// router.delete("/semester/:id", middleWare.isLoggedIn, function(req, res){
// 	Classes.find({})

// 	Semester.findByIdAndRemove(req.params.id, function(err){
// 		if(err){
// 			res.redirect("back");
// 		}else{
// 			res.redirect("/home");
// 		}
// 	});
// });

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
		return [body.class];
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