var express 	= require("express"),
	router 		= express.Router({mergeParams: true}),
	middleWare	= require("../middleware/");

var Semester 	= require("../models/semester"),
	Classes 	= require("../models/class"),
	Assignment  = require("../models/assignment");

//Assignment Creation
router.get("/new", middleWare.isLoggedIn, function(req, res){
	Classes.findById(req.params.id, function(err, foundClass){
		if(err){
			req.flash('error', 'This class does not exist.');
			res.redirect("back");
		}else{
			res.render("assignments/createAssignment", {classData: foundClass});
		}
	});
});

router.post("/new", middleWare.checkClassOwnership, function(req, res){
	Classes.findById(req.params.id, function(err, foundClass){
		if(err){
			req.flash('error', 'This class does not exist.');
			res.redirect("back");
		}else{
			Assignment.create(req.body.assignment, function(err, newAssignment){
				if(err){
					req.flash('error', 'Can not create assignment');
					res.redirect("back");
				}else{

					newAssignment.save();
					foundClass.assignments.push(newAssignment);
					foundClass.save();

					req.flash('success', newAssignment.name + ' assignment added to ' + foundClass.name);
					res.redirect("/class/" + req.params.id);
				}
			})	
		}
	});
});


router.get("/:assignment_id/edit", middleWare.checkAssignmentOwnership, function(req, res){
	Classes.findById(req.params.id, function(err, foundClass){
		if(err){
			req.flash('error', 'Class does not exist');
			res.redirect("back");
		}else{
			Assignment.findById(req.params.assignment_id, function(err, foundAssignment){
				if(err){
					req.flash('error', 'Can not find assignment');
					res.redirect("back")
				}else{
					res.render("assignments/updateAssignment", {classData: foundClass, assignmentData: foundAssignment});
				}
			});			
		}
	});
});

router.put("/:assignment_id", middleWare.checkAssignmentOwnership, function(req, res){
	Assignment.findByIdAndUpdate(req.params.assignment_id, req.body.assignment, function(err, updatedAssignment){
		if(err){
			req.flash('error', 'Could not update assignment');
			res.redirect("back");
		}else{
			req.flash('success', updatedAssignment.name + ' was updated');
			res.redirect("/class/" + req.params.id);
		}
	});
});

router.delete("/:assignment_id/", middleWare.checkAssignmentOwnership, function(req, res){
	Assignment.findByIdAndRemove(req.params.assignment_id, function(err){
		if(err){
			req.flash('error', 'Could not delete assignment');
			res.redirect("back");
		}else{
			req.flash('success', 'Assignment deleted');
			res.redirect("/dashboard");
		}
	});
});

module.exports = router;