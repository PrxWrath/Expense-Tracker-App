const Sequelize = require('sequelize');
const sequelize = new Sequelize('expensetracker', 'root','pratyush',{
    dialect: 'mysql',
    host:'localhost'
})

module.exports = sequelize;