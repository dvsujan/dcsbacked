const express = require('express'); 
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const User = require('./models/User'); 
const userRoutes = require('./routes/user'); 
const movieRoutes = require('./routes/movies');
const reviewRoutes = require('./routes/reviews');
const jwt = require('jsonwebtoken'); 
const app = require("express")();

require('dotenv').config()
// App config
app.use(express.json()); 
app.use(express.urlencoded({extended:false})); 
app.use('/Posters', express.static('Posters')) ; 

const PORT = process.env.PORT||5000 ;

const DBURI = process.env.DBURI ;


mongoose.connect(DBURI,{ useUnifiedTopology: true, useNewUrlParser: true})
    .then((result)=>{
        app.listen(PORT,()=>console.log(`app running @ port: ${PORT}`)); 
        console.log('connected to database');  
    })  
    .catch((error)=>{ 
        console.log(error); 
    })
 
var hashPassword = async (password,rounds=10) => {
  const hash = await bcrypt.hash(password, rounds)
    return hash ; 
}

//sample
app.get('/api',(req,res)=>{
    res.json({
        success:true,
    }); 
});
//routes

app.use('/api/user/',userRoutes); 
app.use('/api/movies/',movieRoutes); 
app.use('/api/review/',reviewRoutes);  

module.exports = app; 