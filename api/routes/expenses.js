const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/auth');
const expenseController = require('../controllers/expenses');

router.get('/', userAuth.authenticate, expenseController.getExpenses);
router.post('/add-expense', userAuth.authenticate, expenseController.postAddExpense);
router.post('/delete-expense',  expenseController.postDeleteExpense);
router.post('/edit-expense',  expenseController.postEditExpense);

module.exports = router;