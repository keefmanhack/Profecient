
var middleWareObj = {};

var Semester = require('../models/semester');
var User = require('../models/user');
var Classes = require('../models/class');

middleWareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect("/login");
};

middleWareObj.checkClassOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		User.findById(req.user._id, function(err, foundUser){
			if(err){
				console.log(err);
				//res.redirect('back');
			}else{
				if(foundUser.semester && foundUser.semester._id){
					Semester.findById(foundUser.semester._id, function(err, foundSemester){
						if(err){
							console.log(err);
							//res.redirect('back');
						}else{
							if(foundSemester && foundSemester.classes){
								foundSemester.classes.forEach(function(o){
									if(o._id == req.params.id){
										next();
									}else{
										//res.redirect('back');
									}
								});
							}else{
								//res.redirect('/login');
							}
						}
					})
				}else{
					//res.redirect('/login');
				}
			}
		});

	}else{
		res.redirect('/login');
	}
}

middleWareObj.checkSemesterOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		User.findById(req.user._id, function(err, foundUser){
			if(err){
				console.log(err);
				//res.redirect('back');
			}else{
				if(foundUser.semester && foundUser.semester._id){
					Semester.findById(foundUser.semester._id, function(err, foundSemester){
						if(err){
							console.log(err);
						}else{
							next();
						}
					})
				}
				console.log(err);
				//res.redirect('/dashboard');
			}
		});
	}
}

middleWareObj.checkAssignmentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
			User.findById(req.user._id, function(err, foundUser){
				if(err){
					console.log(err);
					//res.redirect('back');
				}else{
					if(foundUser.semester && foundUser.semester._id){
						Semester.findById(foundUser.semester._id, function(err, foundSemester){
							if(err){
								console.log(err);
								//res.redirect('back');
							}else{
								if(foundSemester && foundSemester.classes){
									foundSemester.classes.forEach(function(o){
										if(o._id == req.params.id){
											Classes.findById(o._id, function(err, foundClass){
												if(err){
													console.log(err);
													//res.redirect('back');
												}else{
													if(foundClass && foundClass.assignments){
														foundClass.assignments.forEach(function(assignment){
															if(assignment._id == req.params.assignment_id){
																next();
															}
														});
													}else{
														//res.redirect('back');
													}
												}
											});
										}
									});
								}else{
									//res.redirect('/login')
								}
							}
						})
					}
				}
			});
	}else{
		res.redirect('/login');
	}
}


module.exports = middleWareObj;
