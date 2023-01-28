import React, {useState} from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import { useSelector } from 'react-redux';
import axios from 'axios';
import PreviousDownloads from './PreviousDownloads';

const ExpenseReport = (props) => {
  const year = new Date().getFullYear().toString();
  const month = new Date().toLocaleString("en-US", {month:'long'});
  const token = useSelector(state=>state.auth.loginToken);
  const [showDownloads, setShowDownloads] = useState(false);
  const [downloads, setDownloads] = useState(null);

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
  
  //get file download URL
  const  downloadHandler = async() => {
    try{
        const res = await axios.get('http://localhost:4000/expenses/download', {headers: {
        'Authorization' : token
        }});
        if(res.status === 200){
            const link = document.createElement('a');
            link.href = res.data.fileUrl;
            link.download = "MyExpenses.csv";
            document.body.appendChild(link);
            link.click();
        }
    }catch(err){
        console.log('Something went wrong while fetching url')
    }
  }

  //show previiously downloaded files
  const previousDownloadHandler = async() => {
    try{
        const res = await axios.get('http://localhost:4000/expenses/previous-downloads', {headers: {
        'Authorization' : token
        }});
        if(res.status === 200){
            setDownloads(res.data.urls);
            setShowDownloads(prev=>!prev);
        }
    }catch(err){
        console.log('Something went wrong while fetching url')
    }
  }

  return (
    <div className='w-75 mx-auto p-2'>
        <PreviousDownloads setShowDownloads={setShowDownloads} showDownloads={showDownloads} downloads={downloads}/>
        <div className='w-75 mb-3 me-auto'>
            <Button variant='danger' className="ms-auto" onClick={()=>{props.setShowReport(false)}}>Close X</Button>
            
            <Button onClick={downloadHandler} variant="success" className='ms-1'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 bi bi-download" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
                Download
            </Button>
            
            <Button onClick={previousDownloadHandler} variant="secondary" className='ms-1'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 bi bi-download" viewBox="0 0 16 16">
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
                Previous Downloads
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
                <Table responsive bordered striped hover>
                    <thead className='text-center'>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthly?.map(expense=>{
                            return(
                                <tr key={expense.id}>
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
                <Table responsive bordered striped hover>
                    <thead className='text-center'>
                        <tr>
                            <th>Year</th>
                            <th>Total Expenses</th>
                        </tr>
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