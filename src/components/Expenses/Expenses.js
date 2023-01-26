import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import Loader from '../Layout/Loader'
import axios from 'axios'

const Expenses = () => {
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]); 
  const [load, setLoad] = useState(true);
  const [edited, setEdited] = useState(null);

//load from backend
  async function loadExpenses(){
    setLoading(true);
    const res = await axios.get('http://localhost:4000/expenses');
    if(res.data){
      setExpenses(res.data.reverse());
    }
    setLoading(false);
  }
  useEffect(()=>{    
    loadExpenses()
  }, [load]);

  
  return (
    <Container fluid style={{paddingTop:'5rem'}}> 
          <Row>
            <Col xs lg="6" className='mx-auto'>
              <ExpenseForm setLoad = {setLoad} edited={edited} setEdited = {setEdited}/>
            </Col>
          </Row>
          {loading&&<Loader className='my-3 mx-auto'/>}
          <Row>
            <Col xs lg="5" className='mx-auto'>
              <ExpenseList expenses={expenses} setLoad = {setLoad} setEdited={setEdited} setExpenses = {setExpenses}/>
            </Col>
          </Row>
    </Container>
  )
}

export default Expenses;