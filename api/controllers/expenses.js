const Expense = require('../models/Expense');
const AWS = require('aws-sdk');

const uploadToS3 = (fileContent, fileName)=>{
    const s3Bucket = new AWS.S3({
        accessKeyId: process.env.REACT_APP_IAM_ACCESS_KEY,
        secretAccessKey: process.env.REACT_APP_IAM_SECRET,
    })    
    const params = {
          Bucket: process.env.REACT_APP_S3_BUCKET,
          Key: fileName,
          Body: fileContent,
          ACL: 'public-read'
    }

    return new Promise((resolve,reject)=>{
        s3Bucket.upload(params, (err, s3response)=>{
            if(err){
                console.log(err);
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
        const data = await user.getExpenses();
        if(data){
            res.json(data);
        }
    }catch(err){
    console.log(err);
    }
}

exports.getPaginatedExpenses = async(req,res,next) => {
    try{
        const user = req.user;
        let limit = +req.params.limit;
        const data = await user.getExpenses({offset:(req.params.page-1)*limit, limit:limit});
        const count  = await user.countExpenses();
        if(data){
            let pages;
            if(count%limit !== 0){
                while(count%limit!==0 && limit){
                    limit--;
                } 
            }
            pages = Math.floor(count/limit) //total no. of pages = total records/least possible limit
            res.json({expenses:data, pages});
        }
    }catch(err){
        console.log(err);
    }
}

exports.postAddExpense = async(req,res,next) => {
    try{
        const user = req.user;
        await user.createExpense({
            amount: req.body.amount,
            category: req.body.category,
            description: req.body.description
        })
        res.status(200).json({msg:'Created new expense'});
    }catch(err){
        console.log(err);
    }
}

exports.postDeleteExpense = async(req,res,next) => {
    try{
        const id = req.body.id;
        const expense = await Expense.findByPk(id);
        if(expense){
            await expense.destroy();
            res.status(200).json({msg:'Deleted expense'});
        }
    }catch(err){
        console.log(err);
    }
}

exports.postEditExpense = async(req,res,next) => {
    try{
        const id = req.body.id;
        const expense = await Expense.findByPk(id);
        expense.amount = req.body.amount;
        expense.description = req.body.description;
        expense.category  = req.body.category;
        await expense.save();
        res.status(200).json({msg:'Updated expense'});
    }catch(err){
        console.log(err);
    }
}

exports.getDownloadExpenses = async(req,res,next) => {
    try{
        const expenses = await req.user.getExpenses({attributes:['amount', 'description', 'category', 'createdAt', 'updatedAt']});
        const fileName = `Expenses${req.user.id}/${new Date()}.txt`;
        const fileContent = JSON.stringify(expenses);
        const fileUrl = await uploadToS3(fileContent, fileName);
        await req.user.createFileurl({
            url: fileUrl
        })
        res.status(200).json({fileUrl});
    }catch(err){
        console.log(err)
    }
}

exports.getFileUrls = async(req,res,next)=>{
    try{
        const urls = await req.user.getFileurls();
        res.status(200).json({urls});
    }catch(err){
        console.log(err)
    }
}