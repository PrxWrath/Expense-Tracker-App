import React from "react";
import { Button, ListGroup, Alert } from "react-bootstrap";
import classes from './ExpenseList.module.css';
import axios from "axios";
import { useSelector } from "react-redux";

const ExpenseList = (props) => {
    const token = useSelector(state=>state.auth.loginToken)
    const onEdit = (expense) => {
        props.setExpenses(prev=>[...prev.filter(e=>e.id !==expense.id)]);
        props.setEdited(expense);
    }

    const deleteExpenseHandler = async(expense) => {
      try{
        let expenseId = {
          id: expense.id
        }
        const res = await axios.post('http://localhost:4000/expenses/delete-expense',expenseId, {headers: {
          'Authorization' : token
        }});
        if(res.status === 200){
            props.setLoad(prev=>!prev);
        }
      }catch(err){
        console.log(err);
      }
    }
  
    return (
    <>
      {props.expenses?.length?
      <div className='border border-success my-2 rounded'>
      <ListGroup.Item className="bg-success text-light text-center rounded-top w-100 p-1">
        <h3>-- Expenses --</h3>
      </ListGroup.Item>
      <ListGroup className={`mx-auto mt-4 p-2 ${classes.expenseList}`}>
        {props.expenses?.map((expense) => {
          return( 
            <ListGroup.Item key={expense.id} className="d-flex justify-content-between border border-success my-1 mh-75 rounded text-center">
                <h5 className="text-success mx-1" style={{maxWidth:'25%'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="my-auto bi bi-currency-rupee" viewBox="0 0 16 16">
                    <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                  </svg>
                  {expense.amount}
                </h5>
                <h5 className="mx-2 w-25" style={{maxWidth:'25%'}}>{expense.category}</h5>
                <p className={classes.description}>{expense.description}</p>
                    <Button variant="primary" size="sm" className="ms-auto mx-1 h-50" style={{maxHeight:'50%'}} onClick={()=>{onEdit(expense)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                    </Button>
                    <Button variant="danger" size="sm" className="mx-1 h-50" style={{maxHeight:'50%'}} onClick={()=>{deleteExpenseHandler(expense)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                        </svg>
                    </Button>
                
            </ListGroup.Item>
          )
        })}
      </ListGroup>
      </div>
      :
       <Alert className='mx-auto w-50 fw-bold text-center' variant='warning'>No expenses to show :(</Alert>
      }
    </>
  );
};

export default React.memo(ExpenseList);
