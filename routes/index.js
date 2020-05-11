var express = require("express"),
	router = express.Router(),
	passport = require('passport'),
	middleWare	= require("../middleware/");

var async = require('async'),
	nodemailer = require('nodemailer'),
	crypto		= require('crypto');

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
	
	var newUser = new User(
		{
			username: req.body.username,
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName
		});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			res.redirect("back");
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect("/newsemester");
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
});

router.get('/forgot', function(req, res){
	res.render('index/forgot-password');
});

router.post('/forgot', function(req, res, next){
	async.waterfall([
		function(done){
			crypto.randomBytes(20, function(err, bug){
				var token = bug.toString('hex');
				done(err, token);
			});
		},
		function(token, done) {
			User.findOne({username: req.body.username}, function(err, user){
				if(err){
					console.log(err);
				}

				if(!user){
					console.log('no user exists with this username');
					return res.redirect('/forgot');
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000;

				user.save(function(err){
					done(err, token, user);
				});
			});
		}, function(token, user, done){
			var smtpTransport = nodemailer.createTransport({
				host: 'smtp.gmail.com',
   		 		port: 465,
    			secure: true,
				auth: {
					type: 'OAuth2',
					user: 'proficient101010@gmail.com',
					clientId: '104184459333-7mefo7d9nsfn34ngqj8deppfo5o1taot.apps.googleusercontent.com',
					clientSecret: 'vpGsoDvQxtdT8Uz43_9uGCbS',
        			refreshToken: '1//04hEJg0hWBOtCCgYIARAAGAQSNwF-L9Ir28lOCCNw7U-RNUHqsPxDNsX_kcnNKbb3nELEu_jVRtHNVdUQ6bHPidLaoxOh6Z1drJw',
        			accessToken: 'ya29.a0Ae4lvC2l2FTZPKInz0YUQIqzp8EfFgd8_xZWkVHlLR4Va9dB_dgz5S674v6FrzLOLvH7uKilSFbZmh0otoNmKwiD152gCGfv16L6oemAbgIE3tfKUPwMgR9T2cttah8KzOBZQ9zIo8kAp7iYAUf8GM_v1bylbSgawbI'
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'proficient101010@gmail.com',
				subject: 'Proficient password reset',
				text: 'You are receiving this email because you have requested to reset your password ' +
				'for your student account with Proficient.  Please click on the following link or paste the link into your browser to comple the reset process. ' +
				'https://' + req.headers.host + '/reset/' + token + '\n\n' +
				'If you did not request this plese disregard this email.'
			};
			smtpTransport.sendMail(mailOptions, function(err){
				console.log('mail sent');
				//add flash here
				done(err, 'done');
			});
		}
	], function(err){
		if (err){
			console.log(err);
			return next(err);
		} 
		res.redirect('/forgot');
	});
});

router.get('/reset/:token', function(req, res){
	User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
		if(err){
			console.log(err);
		}else{
			res.render('index/resetPassword', {token: req.params.token});
		}
	});
});

router.post('/reset/:token', function(req, res){
	async.waterfall([
		function(done){
			User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
				if(!user){
					console.log('no user');
					res.redirect('back');
				}
				if(req.body.password === req.body.confirm){
					user.setPassword(req.body.password, function(err){
						user.resetPasswordExpires = undefined;
						user.resetPasswordToken = undefined;

						user.save(function(err){
							req.login(user, function(err){

								done(err, user);
							})
						})
					})
				}else{
					console.log('passwords do not match');
					res.redirect('back');
				} 
			});
		},
		function(user, done){
			var smtpTransport = nodemailer.createTransport({
				host: 'smtp.gmail.com',
   		 		port: 465,
    			secure: true,
				auth: {
					type: 'OAuth2',
					user: 'proficient101010@gmail.com',
					clientId: process.env.CLIENTID,
					clientSecret: process.env.CLIENTSECRET,
        			refreshToken: process.env.REFRESHTOKEN,
        			accessToken: process.env.ACCESSTOKEN
				}
			});
			var mailOptions = {
				to: user.email,
				from: 'proficient101010@gmail.com',
				subject: 'Reset successful',
				text: 'Your password was successfully reset.'
			};
			smtpTransport.sendMail(mailOptions, function(err){
				console.log('mail sent');
				//add flash here
				done(err, 'done');
			});
		},
		function(err){
			res.redirect('/login');
		}
	]);
});

module.exports = router;