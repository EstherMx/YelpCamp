//all the middleware
var middlewareObj = {},
	Campground = require("../models/campground"),
	Comment = require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
                res.redirect("back"); //back to the previous page
            }else{
                //does user own the campground?
                //check if the author id = the user id
                if(foundCampground.author.id.equals(req.user._id)){
                   next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back"); 
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
                res.redirect("back"); //back to the previous page
            }else{
                //does user own the comment?
                //check if the author id = the user id
                if(foundComment.author.id.equals(req.user._id)){
                   next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back"); 
    }
}

module.exports = middlewareObj;