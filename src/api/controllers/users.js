const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id, name) => {
    return jwt.sign({userId: id, name}, 'A344525etee%2@33362djsbasshhf'); //encrypt the userID to produce a unique token
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
                    res.status(200).json({token: token, msg:'User login successfull'}); //send login token
                }
            })
        }
    }catch(err){
        console.log(err)
    }

}