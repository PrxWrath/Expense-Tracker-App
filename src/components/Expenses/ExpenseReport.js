import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'

const ExpenseReport = (props) => {
  const year = new Date().getFullYear().toString();
  const month = new Date().toLocaleString("en-US", {month:'long'});
  
  //filter out monthly expenses
  const monthly = props.expenses?.filter(expense=>{
    return new Date(expense.updatedAt).toLocaleString("en-US", {month:'long'}) === month;
  })
  
  const monthlyTotal = monthly.reduce((initial, expense)=>{
    return initial += expense.amount
  },0);

  //filter out yearly expenses
  const yearly = props.expenses?.filter(expense=>{
    return new Date(expense.updatedAt).toLocaleString("en-US", {year:'numeric'}) === year;
  })
  
  const yearlyTotal = yearly.reduce((initial, expense)=>{
    return initial += expense.amount
  },0);

  return (
    <div className='w-75 mx-auto p-2'>
        <div className='w-50 my-1 me-auto'>
            <Button variant='danger' className="ms-auto" onClick={()=>{props.setShowReport(false)}}>Close X</Button>
            <Button variant="success" className='ms-1'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 bi bi-download" viewBox="0 0 16 16">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
                Download
            </Button>
        </div>
        <Row>
            <Col xs lg='6' className='mx-auto'>
                <h2 className='text-center text-light bg-success p-1 rounded'>Expense Report - {year}</h2>
            </Col>
        </Row>
        <Row>
            <Col xs lg='6' className='mx-auto'>
                <h3 className='text-center'> {month} </h3>
            </Col>
        </Row>
        <Row>
            <Col xs lg='8' className='mx-auto'>
                <Table bordered striped hover>
                    <thead className='text-center'>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                    </thead>
                    <tbody>
                        {monthly?.map(expense=>{
                            return(
                                <tr>
                                    <td>{new Date(expense.updatedAt).toLocaleString("en-US",{month:'2-digit', day:'2-digit', year:'numeric'})}</td>
                                    <td>{expense.description}</td>
                                    <td>{expense.category}</td>
                                    <td className='text-success'>{expense.amount}</td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td> </td>
                            <td> </td>
                            <td> </td>
                            <td className='fw-bold text-success'> Total: Rs. {monthlyTotal}</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
        </Row>
        
        <Row>
            <Col xs lg='6' className='mx-auto'>
                <h3 className='text-center'> Yearly Expenditure </h3>    
            </Col>
        </Row>
     
        <Row>
            <Col xs lg='4' className='mx-auto'>
                <Table bordered striped hover>
                    <thead className='text-center'>
                        <th>Year</th>
                        <th>Total Expenses</th>
                    </thead>
                    <tbody>
                        <tr> 
                            <td>{year}</td> 
                            <td className='fw-bold text-success'>Total: Rs. {yearlyTotal}</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
        </Row>
        
    </div>
  )
}

export default ExpenseReport