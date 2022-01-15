//jshint esversion:6
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs'); 
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express(); 
app.use(express.static("public")); 
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true})); 
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema =new mongoose.Schema({
    email: String,
    password: String
});
const secret = "ThisIsTheEncryptionSecretKey"
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
})
app.get("/login", function(req, res){
 res.render("login");
})

app.post("/login", function(req, res){
    const username = req.body.username;
    
    
    User.findOne({email: username}, function(err, foundUser){

      

        if(err){
            console.log(err);
            }else{
                if(req.body.password===foundUser.password){
                    res.render("secrets");
                }else{
                    res.send("wrong password");
                }
            }
    })
})
app.get("/register", function(req, res){
    res.render("register");
    
})

app.post("/register", function(req, res){

    const newUser = new User({
        email:  req.body.username, 
        password : req.body.password
    });

    newUser.save(function(err){
        
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
       
        })
    });


app.listen(3000, function(){
console.log("your server started at port 3000");
});

