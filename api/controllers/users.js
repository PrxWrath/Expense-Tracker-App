const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id, name) => {
    return jwt.sign({userId: id, name}, process.env.REACT_APP_USER_SECRET); //encrypt the userID to produce a unique token
}

exports.postAddUser = async(req,res,next) => {
    try{
        const data = await User.findOne({where: {email:req.body.email}});
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
        console.log(err)
    }
}

exports.postFindUser = async(req,res,next) => {
    try{
        const data = await User.findOne({where:{email:req.body.email}});
        if(!data){
            res.json({err: 'User not found!'}).status(404);
        }else{
            bcrypt.compare(req.body.password, data.password, (err, cmp)=>{
                if(!cmp){
                    res.json({err: 'Invalid Credentials! User not authorized'}).status(401);
                }else{
                    const token = generateToken(data.id, data.name);
                    res.status(200).json({token: token, premium: data.isPremium , msg:'User login successfull'}); //send login token and premium status
                }
            })
        }
    }catch(err){
        console.log(err)
    }
}

exports.postForgotPassword = async(req,res,next) => {
    try{
        const user = await User.findOne({where:{email:req.body.email}});
        if(user){
            res.status(200).json({url:'http://localhost:4000/users/reset-password/dummy-id'});
        }else{
            res.json({err:'User not found!'});
        }
    }catch(err){
        console.log(err)
    }
    
}