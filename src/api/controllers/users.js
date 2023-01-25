const User = require('../models/user');

exports.postAddUser = async(req,res,next) => {
    try{
        const data = await User.findOne({where: {email:req.body.email}});
        if(data){
            res.json({
                error: 'Account with provided email already exists!'
            })
        }else{
            await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            res.redirect('/');
        }
        
    }catch(err){
        console.log(err)
    }
}

exports.postFindUser = async(req,res,next) => {
    try{
        const data = await User.findOne({where:{email:req.body.email}});
        if(!data){
            res.json({error: 'User not found!'});
        }else{
            if(data.password!==req.body.password){
                res.json({error: 'Invalid Credentials! User not authorized'});
            }else{
                res.json({email: data.email, msg:'User login successfull'});
            }
        }
    }catch(err){
        console.log(err)
    }

}