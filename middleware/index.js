
var middleWareObj = {};

middleWareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect("/login");
};

// middleWareObj.checkSemesterOwnership = function(req, res, next){
// 	if(req.isAuthenticated()){	
// 		Semester.findById(req.params.id, function(err, foundSemester){
// 			if(err){
// 				res.redirect("back");
// 			}else{
// 				if(foundSemester.student.id.equals(req.user._id)){
// 					next();
// 				}else{
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	}else{
// 		res.redirect("back");
// 	}
// }

module.exports = middleWareObj;
