import React, { useEffect, useRef, useState } from 'react'
import { Alert, Button, FloatingLabel, Form } from 'react-bootstrap'
import axios from 'axios';
import { useSelector } from 'react-redux';

const ExpenseForm = (props) => {
    
    const amountRef = useRef();
    const descRef = useRef();
    const categoryRef = useRef();
    const [alert, setAlert] = useState(<></>);
    const token = useSelector(state=>state.auth.loginToken);

    useEffect(()=>{
        if(props.edited){
            document.getElementById('amount').value = props.edited.amount;
            document.getElementById('description').value = props.edited.description;
        } 
    }, [props.edited]);
    

    const addExpenseHandler = async() => {
        //validate form
        if(!amountRef.current.value || !descRef.current.value){
            setAlert(<Alert variant='warning'>Fill all the fields!</Alert>)   
            setTimeout(()=>{setAlert(<></>)}, 2000);     
        }else{
            try{
                let res;
                //check if new expense or old expense updation
                if(!props.edited){
                    let expense = {
                        amount: amountRef.current.value,
                        category: categoryRef.current.value,
                        description: descRef.current.value
                    }
                    res = await axios.post('http://localhost:4000/expenses/add-expense', expense, {headers: {
                        'Authorization' : token
                      }});
                }else{
                    let expense = {
                        id: props.edited._id,
                        amount: amountRef.current.value,
                        category: categoryRef.current.value,
                        description: descRef.current.value
                    }
                    res = await axios.post('http://localhost:4000/expenses/edit-expense', expense, {headers: {
                        'Authorization' : token
                      }});
                    props.setEdited(null);
                }

                if(res.status === 200){
                    amountRef.current.value = '';
                    descRef.current.value = '';
                    props.setLoad(prev=>!prev);
                }
            }catch(err){
                console.log(err);
            }   
        }
    }
    
    return (
    <>
        <Form className="my-3 mx-auto w-75 rounded border border-success" >
            <h3 className='w-100 bg-success text-center mb-3 text-light rounded-top'>{props.edited?'Update Expense':'Add Expense'}</h3>
            {alert}
            <FloatingLabel controlId='amount' className='mb-3 mx-auto w-75' label='Amount (Rs.)'>
                <Form.Control type='number' min={1} step={1} ref={amountRef}/>
            </FloatingLabel>
            <FloatingLabel controlId='description' className='mb-3 mx-auto w-75' label='Description'>
                <Form.Control type='text' ref={descRef}/>
            </FloatingLabel>
            <FloatingLabel controlId='category' className='mb-3 mx-auto w-75' label='Category'>
                <Form.Select ref={categoryRef}>
                    <option value="Groceries">Groceries</option>
                    <option value="Bills">Bills</option>
                    <option value="Transport">Transport</option>
                    <option value="Recreational">Recreational</option>
                </Form.Select>
            </FloatingLabel>
            <div className='w-100 text-center my-2'>
                <Button onClick={addExpenseHandler} variant='success' className='mx-1' size='lg'>{props.edited?'Update Expense':'+ Add Expense'}</Button>
            </div>
        </Form>
    </>
  )
}

export default React.memo(ExpenseForm);