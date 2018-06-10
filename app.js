var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
		{name: "Salmon Creek", image:"https://www.nps.gov/lacl/planyourvisit/images/Image-w-cred-cap_-1200w-_-Visit-Silver-Salmon-Creek-Page_2.jpg?maxwidth=1200&maxheight=1200&autorotate=false"},
		{name: "Granite Hill", image:"http://www.americansouthwest.net/new_mexico/photographs700/aguirre-hill.jpg"}
	]

app.get("/", function(req,res){
	res.render("landing");
});

app.get("/campgrounds", function(req,res){
	res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req,res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name:name, image:image}
	campgrounds.push(newCampground);
	//redirect back to campgrounds page
	res.redirect("/campgrounds");  //will redirect to the get request
});

app.get("/campgrounds/new", function(req,res){
	res.render("new");
});

var port = process.env.PORT || 3000;
app.listen(3000, function(){
	console.log("App listening on port " + port);
});