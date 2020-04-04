var express 		= require("express"),
    app     		= express(),
    mongoose		= require('mongoose'),
    passport		= require('passport'),
    LocalStrategy	= require('passport-local'),
    bodyParser		= require('body-parser');



var User 			= require("./models/user");



//Mongoose random things
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//connect to mongoose, change PASSWORD in the future (before GITHUB)
mongoose.connect("mongodb+srv://keefmanjack:simple@firstdatabase-bdxnh.mongodb.net/Profecient?retryWrites=true&w=majority");

//passport configuration
app.use(require("express-session")({
	secret: "I want a cat",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


app.set("view engine", "ejs");


app.get("/", function(req, res){
	res.render("landing");
});


//login and signup routes
app.get("/signup", function(req, res){
	res.render("signup");
});

app.post("/signup", function(req, res){
	
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			res.redirect("back");
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect("/home");
		});
	});
 });

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/home",
	failureRedirect: "back"
}), function(req, res){

});



app.get("/home", function(req, res){
	res.render("home");
});

app.listen(3000, 'localhost', function(){
	console.log("Server started on port 3000");
});