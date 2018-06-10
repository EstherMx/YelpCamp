var express = require("express");
var app = express();

app.set("view engine", "ejs");


app.get("/", function(req,res){
	res.render("landing");
});

app.get("/campgrounds", function(req,res){
	var campgrounds = [
		{name: "Salmon Creek", image:"https://www.nps.gov/lacl/planyourvisit/images/Image-w-cred-cap_-1200w-_-Visit-Silver-Salmon-Creek-Page_2.jpg?maxwidth=1200&maxheight=1200&autorotate=false"},
		{name: "Granite Hill", image:"http://www.americansouthwest.net/new_mexico/photographs700/aguirre-hill.jpg"}
	]
	res.render("campgrounds", {campgrounds:campgrounds});
});


var port = process.env.PORT || 3000;
app.listen(3000, function(){
	console.log("App listening on port " + port);
});