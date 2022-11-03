var mongoose = require("mongoose");

var userPostSchema = new  mongoose.Schema({
  userId:{
    type: String,
    require:true,

  },
  desc:{
    type:String,
    max:200,

  },
  img:{
    type: Array,
    default:[],
  },
  likes:{
    type: Array,
    default: [],

  },
},

{timestamps: true}

);

module.exports = mongoose.model("userPost", userPostSchema)