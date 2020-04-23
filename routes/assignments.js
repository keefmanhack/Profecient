var express 	= require("express"),
	router 		= express.Router({mergeParams: true}),
	middleWare	= require("../middleware/");

var Semester 	= require("../models/semester"),
	Assignment  = require("../models/newAssignment");

//Assignment Creation
router.get("/new", middleWare.isLoggedIn, function(req, res){
	Semester.findOne({'classes._id': req.params.class_id}, function(err, foundSemester){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			foundSemester.classes.forEach(function(queryClass){
				if(queryClass._id == req.params.class_id){
					res.render("assignments/createAssignment", {classData: queryClass});
				}
			});
			
		}
	});
});

router.post("/new", middleWare.isLoggedIn, function(req, res){
	Semester.findOne({'classes._id': req.params.class_id}, function(err, foundSemester){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			Assignment.create(req.body.assignment, function(err, newAssignment){
				if(err){
					console.log(err);
					res.redirect("back");
				}else{
					newAssignment.student.id = req.user._id;
					newAssignment.student.username = req.user.username;

					newAssignment.save();
					foundSemester.classes.forEach(function(queryClass){
						if(queryClass._id == req.params.class_id){
							queryClass.assignments.push(newAssignment);
						}
					});
					
					foundSemester.save();
					res.redirect("/class/" + req.params.class_id);
				}
			})	
		}
	});
});

// class/5e96679e43a3138642ca872d/Assignment/5e96735943a3138642ca8731/edit

router.get("/:assignment_id/edit", middleWare.isLoggedIn, function(req, res){
	Semester.findOne({'classes._id': req.params.class_id}, function(err, foundSemester){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			Assignment.findById(req.params.assignment_id, function(err, foundAssignment){
				if(err){
					console.log(err);
					res.redirect("back")
				}else{
					foundSemester.classes.forEach(function(queryClass){
						if(queryClass._id == req.params.class_id){
							res.render("assignments/updateAssignment", {classData: queryClass, assignmentData: foundAssignment});
						}
					});
				}
			});			
		}
	});
});

router.put("/:assignment_id", middleWare.isLoggedIn, function(req, res){
	Assignment.findByIdAndUpdate(req.params.assignment_id, req.body.assignment, function(err, updatedAssignment){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.redirect("/class/" + req.params.class_id);
		}
	});
});

router.delete("/:assignment_id/", middleWare.isLoggedIn, function(req, res){
	Assignment.findByIdAndRemove(req.params.assignment_id, function(err){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.redirect("/class/" + req.params.class_id);
		}
	});
});

module.exports = router;