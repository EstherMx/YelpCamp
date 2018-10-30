var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

//requiring Routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost/yelp_camp");
//app.use affects every file of the app
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); // this connects this app to the styling sheet
app.use(methodOverride("_method"));
// seedDB(); //run function seedDB from seed.js

// PASSPORT PRE-CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

//PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Creating a middleware for currentUser with "next" that can be used on any file
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);

var port = process.env.PORT || 3000;
app.listen(3000, function(){
  console.log("App listening on port " + port);
});

