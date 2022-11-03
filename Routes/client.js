var userSc = require("../models/userSc");
var Router = require("express").Router();
var bcrypt = require("bcrypt");

//new user update
Router.put("/:id", async function(request, respond){
    if (request.body.userId === request.params.id || request.body.isAdmin){
        if (request.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                request.body.password = await bcrypt.hash(request.body.password, salt);
            } catch(err){
                return respond.status(500).json(err);
            }
        }
        try{
            const user = await userSc.findByIdAndUpdate(request.params.id, {
                $set: request.body,
            });
            respond.status(200).json("Account has been updated");

        } catch (err) {
            return respond.status(500).json(err);
        } 
    } else{
        return respond.status(403).json("Administer Only");
    }
});

//delete user
Router.delete("/:id", async function(request, respond){
    if (request.body.userId === request.params.id || request.body.isAdmin){
     
        try{
            const user = await userSc.findByIdAndDelete(request.params.id);
            respond.status(200).json("Account has been deleted");

        } catch (err) {
            return respond.status(500).json(err);
        } 
    } else{
        return respond.status(403).json("You can only delete your account");
    }
});

//Find a user
Router.get("/:id", async function(request, respond){
    try{
        const user = await userSc.findById(request.params.id);
        const {password, updateAt, ...other} = user._doc
        respond.status(200).json(other)

    }catch(err){
        respond.status(500).json(err)

    }
})

//follow method
Router.put("/:id/follow", async function(request,respond){
    if (request.body.userId !== request.params.id){
        try{
            const user = await userSc.findById(request.params.id);
            const currentUser = await userSc.findById(request.body.userId);
            if(!user.followers.includes(request.body.userId)){
                await user.updateOne({$push:{followers: request.body.userId}});
                await currentUser.updateOne({$push:{followings: request.params.id}});
                respond.status(200).json("your are now following this account")
            }else{
                respond.status(403).json("you already follow this account")
            }
        } catch (err) {
            respond.status(500).json(err);

        }
    }
    else{
        respond.status(403).json("Invalid request: you can't follow yourself");
    }
})

//unfollow method
Router.put("/:id/unfollow", async function(request,respond){
    if (request.body.userId !== request.params.id){
        try{
            const user = await userSc.findById(request.params.id);
            const currentUser = await userSc.findById(request.body.userId);
            if(user.followers.includes(request.body.userId)){
                await user.updateOne({$pull:{followers: request.body.userId}});
                await currentUser.updateOne({$pull:{followings: request.params.id}});
                respond.status(200).json("your have unfollow this account")
            }else{
                respond.status(403).json("you have not follow this account")
            }
        } catch (err) {
            respond.status(500).json(err);

        }
    }
    else{
        respond.status(403).json("Invalid request: you can't follow yourself");
    }
})

module.exports = Router