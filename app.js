var express 			= require("express"),
    app     			= express(),
    mongoose			= require('mongoose'),
    passport			= require('passport'),
    LocalStrategy		= require('passport-local'),
    bodyParser			= require('body-parser'),
    methodOverride  	= require('method-override');

var indexRoutes			= require("./routes/index"),
	semesterRoutes		= require("./routes/semester"),
	assignmentRoutes	= require("./routes/assignments");

var User 				= require("./models/user"),
	Semester 			= require("./models/semester");



//Mongoose random things
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

let mongoUrl = process.env.PROFICIENT_MONGO_DB;

mongoose.connect(mongoUrl);

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
app.use(express.static(__dirname + '/public')); //for js scripts
app.use(methodOverride("_method"));

app.use(indexRoutes);
app.use("/class/:id/Assignment/", assignmentRoutes);
app.use(semesterRoutes);



app.get("/calendar/semesterData", function(req, res){
	User.findById(req.user._id).populate({path: 'semester', populate: {path: 'classes', populate: {path: 'assignments'}}}).exec(function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			if(foundUser && foundUser.semester && foundUser.semester.classes){
				res.send(foundUser.semester.classes);
			}
		}
	});
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);