const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const strreq = { 
    type:String, 
    require:true, 
}

const strtep = { 
    type:String, 
    require:true, 
    unique:true,
    es_indexed: true
}

const UserSchema = new Schema({ 
    userId:mongoose.Schema.ObjectId,
    movieId:mongoose.Schema.ObjectId, 
    rating:{
        type:Number,
        min:1,
        max:10,
        require:true,
    },
    review:{
        type:String,
        default:"",
    },
},{timestamps:true});

const Review = mongoose.model('Review', UserSchema);
module.exports = Review ;  
