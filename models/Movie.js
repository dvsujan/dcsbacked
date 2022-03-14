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
    name:strreq, 
    poster:strreq, 
    description:strreq,
    genre:strreq,
    release:{
        type:Date,
        default:Date.now,
        require:true,
    },
    duration:{
        type:Number, 
        require:true,
    },
},{timestamps:true});

const Movie = mongoose.model('movie', UserSchema);
module.exports = Movie ;  
