const logger = require('../services/logger');
const User = require('../models/user');

exports.getShowLeaders = async(req,res,next) => {
    try{
        const leaders = await User.aggregate([
            {
                $lookup:{
                    from: 'expenses',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'expenses'
                } //get data from expenses collection
            },
            {
                $addFields:{
                    total: { $sum: '$expenses.amount'}
                }
            },
            {
                $sort:{total: -1}
            }
        ])
        //aggregate expenses and users collection to produce leader data 
        
        res.status(201).json({leaders})
    }catch(err){
        logger.write(err.stack);
    }
}