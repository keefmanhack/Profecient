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
	if(req.body.password !== req.body.confirm){
		req.flash('error', 'Passwords do not match.');
		res.redirect('/signup');
	}else{

		User.register(newUser, req.body.password, function(err, user){
			if(err){
				req.flash('error', 'User already exists with these credentials.');
				res.redirect("/signup");
			}
			passport.authenticate('local')(req, res, function(){
				req.flash('success', 'Welcome to Proficient ' + user.firstName + '. Start by creating your first class schedule!');
				res.redirect("/newsemester");
			});
		});
	}
 });

router.get("/login", function(req, res){
	res.render("index/login", {message: req.flash("error")});
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/dashboard",
	failureRedirect: "/login",
	failureFlash: 'Invalid username or password.',
	successFlash: 'Welcome!'
}), function(req, res){

});

router.get('/sign_out', function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect('/login');
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

				if(!user){
					req.flash('error', 'No user exists with this username.');
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
					clientId: process.env.CLIENTID,
					clientSecret: process.env.CLIENTSECRET,
        			refreshToken: process.env.REFRESHTOKEN,
        			accessToken: process.env.ACCESSTOKEN
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
				req.flash('success', 'Email with reset link has been sent to the inbox linked to your Proficient account!');
				done(err, 'done');
			});
		}
	], function(err){
		if (err){
			req.flash('error', 'There was a problem access your account.');
			return next(err);
		} 
		res.redirect('/forgot');
	});
});

router.get('/reset/:token', function(req, res){
	User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
		if(err){
			req.flash('error', 'Invalid address.');
			res.redirect('/forgot');
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
					flash('error', 'User does not exist or email link has timed out');
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
					req.flash('error', 'Passwords do not match');
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
				req.flash('success', 'Your password has been reset!');
				done(err, 'done');
			});
		},
		function(err){
			req.flash('There was a problem with reseting your password.');
			res.redirect('/login');
		}
	]);
});

module.exports = router;