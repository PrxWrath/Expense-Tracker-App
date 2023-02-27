const Expense = require('../models/Expense');
const AWS = require('aws-sdk');
const logger = require('../services/logger');
const File = require('../models/File');

const uploadToS3 = (fileContent, fileName)=>{
    const s3Bucket = new AWS.S3({
        accessKeyId: process.env.IAM_ACCESS_KEY,
        secretAccessKey: process.env.IAM_SECRET,
    })    
    const params = {
          Bucket: process.env.S3_BUCKET,
          Key: fileName,
          Body: fileContent,
          ACL: 'public-read'
    }

    return new Promise((resolve,reject)=>{
        s3Bucket.upload(params, (err, s3response)=>{
            if(err){ 
                reject(err);
            }else{
                resolve(s3response.Location);
            }
        })
    })
    
}

exports.getExpenses = async(req,res,next) => {
    try{
        const user = req.user;
        const data = await Expense.find({userId: user._id});
        if(data){
            res.json(data);
        }
    }catch(err){
        logger.write(err.stack)
    }
}

exports.getPaginatedExpenses = async(req,res,next) => {
    try{
        const user = req.user;
        let limit = +req.params.limit;
        const data = await Expense.find({userId: user._id}).skip((req.params.page-1)*limit).limit(limit);
        const count  = data.length;
        if(data){
            let pages;
            if(count%limit !== 0){
                while(count%limit!==0 && limit){
                    limit--;
                } 
            }
            pages = Math.floor(count/limit) //total no. of pages = total records/max possible limit
            res.json({expenses:data, pages});
        }
    }catch(err){
        logger.write(err.stack)
    }
}

exports.postAddExpense = async(req,res,next) => {
    try{
        const user = req.user;
        await Expense.create({
            amount: req.body.amount,
            category: req.body.category,
            description: req.body.description,
            updatedAt: new Date(),
            userId: user._id
        })
        res.status(200).json({msg:'Created new expense'});
    }catch(err){
        logger.write(err.stack)
    }
}

exports.postDeleteExpense = async(req,res,next) => {
    try{
        const id = req.body.id;
        await Expense.deleteOne({_id:id});
        res.status(200).json({msg:'Deleted expense'});
    }catch(err){
        logger.write(err.stack)
    }
}

exports.postEditExpense = async(req,res,next) => {
    try{
        const id = req.body.id;
        console.log(id)
        await Expense.updateOne({_id: id}, {amount: req.body.amount, description: req.body.description, category: req.body.category, updatedAt: new Date()});
        res.status(200).json({msg:'Updated expense'});
    }catch(err){
        logger.write(err.stack)
    }
}

exports.getDownloadExpenses = async(req,res,next) => {
    try{
        const expenses = await Expense.find({_id: req.user._id}, 'amount description category updatedAt');
        const fileName = `Expenses${req.user.id}/${new Date()}.txt`;
        const fileContent = JSON.stringify(expenses);
        const fileUrl = await uploadToS3(fileContent, fileName);
        await File.create({
            url: fileUrl,
            userId: req.user._id,
            updatedAt: new Date()
        })
        res.status(200).json({fileUrl});
    }catch(err){
        logger.write(err.stack)
    }
}

exports.getFileUrls = async(req,res,next)=>{
    try{
        const urls = await File.find({userId: req.user._id});
        res.status(200).json({urls});
    }catch(err){
        logger.write(err.stack)
    }
}