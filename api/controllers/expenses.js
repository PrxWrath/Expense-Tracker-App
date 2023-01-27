const Expense = require('../models/Expense');

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