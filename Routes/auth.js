var Router = require("express").Router();
var userSc = require("../models/userSc");
var bcrypt = require("bcrypt");


//register
Router.post("/register",async function (request, respond){
    try{
        //generate secure password
        const salt = await bcrypt.genSalt(10);
        const hidePass = await bcrypt.hash(request.body.password, salt)
        const reguser = await new userSc({
            username: request.body.username,
            email: request.body.email,
            password: hidePass
        });

        //save user infor and respond
        const user = await reguser.save();
        respond.status(200).json(user);

    }catch(err){
        respond.status(500).json(err);

    }
});

//login
Router.post("/login", async function(request,response){
    try{
    const user = await userSc.findOne({email: request.body.email});
    !user && response.status(404).json("User not found")

    const validPass = await bcrypt.compare(request.body.password, user.password)
    !validPass && response.status(400).json("Your password is not correct");

    response.status(200).json(user)
    
    }catch(err){
        response.status(500).json(err);
    }



});


module.exports = Router;