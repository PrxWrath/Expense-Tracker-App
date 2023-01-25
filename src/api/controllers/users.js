const User = require('../models/user');
const bcrypt = require('bcrypt');

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
                    res.status(200).json({email: data.email, msg:'User login successfull'});
                }
            })
        }
    }catch(err){
        console.log(err)
    }

}