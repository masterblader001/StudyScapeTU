var Router = require("express").Router();
const userPostSchema = require("../models/userPostSchema");
const userPost = require("../models/userPostSchema");
const userSc = require("../models/userSc");

//Posting

Router.post("/", async function(request,respond){
    const NewPost = new userPost(request.body);
    try{
        const SavePost = await NewPost.save();
        respond.status(200).json(SavePost);

    }catch (err){
        respond.status(500).json(err);
    }
});

//editing Post
Router.put("/:id", async function(request,respond){
    try{
        const post = await userPost.findById(request.params.id);
        if (post.userId === request.body.userId){
            await post.updateOne({$set:request.body});
            respond.status(200).json("The post had been edited")
         } else {
        respond.status(403).json("You can't edit the other post");
        }
    } catch(err) {
        respond.status(500).json(err)
    }
});

//deleting post
Router.delete("/:id", async function(request,respond){
    try{
        const post = await userPost.findById(request.params.id);
        if (post.userId === request.body.userId){
            await post.deleteOne({$set:request.body});
            respond.status(200).json("The post had been deleted")
         } else {
        respond.status(403).json("You can't deleted the other post");
        }
    } catch(err) {
        respond.status(500).json(err);
    }
});

//getting post 
Router.get("/:id", async function(request,respond){
    try{ 
        const post = await userPost.findById(request.params.id);
        respond.status(200).json(post);

    }catch(err){
        respond.status(500).json(err);
    }

});

//feed post
Router.get("/timeline/feed", async function(request, respond){
    try{
        const currentUser = await userSc.findById(request.body.userId);
        const userPost = await userPostSchema.find({userId: currentUser._id});
        const followPost = await Promise.all(
            currentUser.followings.map(function(friendId){
               return userPostSchema.find({userId: friendId});
            })
        );
        respond.json(userPost.concat(...followPost))
    } catch(err){
        respond.status(500).json(err);
    }
})

module.exports = Router;