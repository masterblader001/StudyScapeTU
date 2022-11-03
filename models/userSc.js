var mongoose = require("mongoose");

var UserSchema = new  mongoose.Schema({
    username:{
        type:String,
        require: true,
        min: 5,
        max: 20,
        unique: true,
    },
    email:{
        type:String,
        require:true,
        max:50,
        unique: true,
    },
    password:{
        type:String,
        require:true,
        min:6,

    },
    profilePic:{
        type:String,
        default:"",
    },
    coverPic:{
        type:String,
        default:"",

    },
    followers:{
        type:Array,
        default:[],
    },
    followings:{
        type:Array,
        default:[],
    },
    isAdmin:{
        type:Boolean,
        default: false,
    },
    
},

{timestamps: true}

);

module.exports = mongoose.model("userSc", UserSchema)