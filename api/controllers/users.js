const User = require('../models/user');
const Forgot = require('../models/Forgot');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../services/logger');
const { default: mongoose } = require('mongoose');

const generateToken = (email, name) => {
    return jwt.sign({email, name}, process.env.USER_SECRET); //encrypt the userID to produce a unique token
}

exports.postAddUser = async(req,res,next) => {
    try{
        const data = await User.findOne({email: req.body.email})
        if(data){
            res.json({
                error: 'Account with provided email already exists!'
            })
        }else{
            bcrypt.hash(req.body.password, 10, async(err, hash)=>{
                await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                })
                res.status(201).json({msg:'Your account has been created! Login with new account :)'});
            })
        }
        
    }catch(err){
        logger.write(err.stack);
    }
}

exports.postFindUser = async(req,res,next) => {
    try{
        const data = await User.findOne({email:req.body.email});
        if(!data){
            res.json({err: 'User not found!'}).status(404);
        }else{
            bcrypt.compare(req.body.password, data.password, (err, cmp)=>{
                if(!cmp){
                    res.json({err: 'Invalid Credentials! User not authorized'}).status(401);
                }else{
                    const token = generateToken(data.email, data.name);
                    res.status(200).json({token: token, premium: data.isPremium , msg:'User login successfull'}); //send login token and premium status
                }
            })
        }
    }catch(err){
        logger.write(err.stack);
    }
}

exports.postForgotPassword = async(req,res,next) => {
    try{
        const user = await User.findOne({email:req.body.email}); 
        if(user){
            //create new reset password request
            const request = await Forgot.create({
                isActive: true,
                userId: user._id
            });
            let reset_id = request._id;
            res.status(200).json({url:`http://localhost:4000/users/reset-password/${reset_id}`});
        }else{
            res.json({err:'User not found!'});
        }
    }catch(err){
        logger.write(err.stack);
    }
    
}

exports.getResetPassword = async(req,res,next) => {
    try{
        
        //send form to reset password
        res.send(`
        <h3>
            Enter new password:
        </h3>
        <form action='/users/reset-password' method="POST">
            <input type="text" name="new_pass"/>
            <input type="hidden" name="reset_id" value="${req.params.reset_id}"/>
            <button type="submit">Reset Password</button>
        </form>`)
    }catch(err){
        logger.write(err.stack);
    }  
}

exports.postResetPassword = async(req,res,next) => {
    try{   
        const reset_id = req.body.reset_id;
        const reset_pass = req.body.new_pass;
        const request = await Forgot.findById(reset_id); //find the request with the given id
    
        if(request){
            const user = await User.findById(request.userId);
            bcrypt.hash(reset_pass, 10, async(err, hash)=>{
                user.password = hash
                await user.save();   
            })
            await Forgot.deleteOne({_id: reset_id}); //remove the request after reset
            res.send('<h3>Password Changed! Go back and login with new password</h3>') 
        }
        else res.status(400);
    }catch(err){
        logger.write(err.stack);
    }
}