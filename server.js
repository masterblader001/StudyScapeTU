//declare variable 
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var helmet = require("helmet");
var morgan = require("morgan");

var userRoute = require("./Routes/client");
var authRoute = require("./Routes/auth");
var postRoute = require("./Routes/post");


//use dotenv
dotenv.config();

//connect to MongoDB
mongoose.connect(process.env.mongodb_url, function(){
    console.log("Connecting to MongoDB");
    
});


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/client", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);



//try listen from app
app.listen(8800,function(){
    console.log("Server is starting....");
}) 