var express = require("express"),
	router = express.Router(),
	passport = require('passport'),
	middleWare	= require("../middleware/");

var User = require("../models/user");

// router.get("*", function(req, res){
// 	res.redirect("/");
// });

router.get("/", function(req, res){
	res.render("index/landing");
});

//login and signup routes
router.get("/signup", function(req, res){
	res.render("index/signup");
});

router.post("/signup", function(req, res){
	
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			res.redirect("back");
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect("/dashboard");
		});
	});
 });

router.get("/login", function(req, res){
	res.render("index/login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/dashboard",
	failureRedirect: "back"
}), function(req, res){

});

router.get('/sign_out', function(req, res){
	req.logout();
	res.redirect('/');
})

module.exports = router;