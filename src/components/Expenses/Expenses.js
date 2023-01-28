import React, { useCallback, useEffect, useState } from 'react'
import { Col, Container, Pagination, Row } from 'react-bootstrap'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import Loader from '../Layout/Loader'
import axios from 'axios'
import { useSelector } from 'react-redux';
import Features from './Features'
import LeaderBoard from './LeaderBoard'
import ExpenseReport from './ExpenseReport'

const Expenses = () => {
  const [loading, setLoading] = useState(false);
  const token = useSelector(state=>state.auth.loginToken);
  const [expenses, setExpenses] = useState([]); 
  const [load, setLoad] = useState(true);
  const [edited, setEdited] = useState(null);
  const [showLeader, setShowLeader] = useState(false);
  const [leaderData, setLeaderData] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  
  
//load from backend
  const loadExpenses = useCallback(async()=>{
    setLoading(true);
    try{
      //get expense page as specified
      const res = await axios.get(`http://localhost:4000/expenses/paginated/${page}/3`, {headers: {
        'Authorization' : token
      }});
      
      if(res.data){
        setExpenses(res.data.expenses.reverse());
        setPages(res.data.pages);
      }
    }catch(err){
      console.log(err);
    }  
    setLoading(false);
  },[token, page]);

  useEffect(()=>{    
    loadExpenses()
  }, [load, loadExpenses]);

  //update page that triggers load expenses for that page
  const prevPageHandler = () => {
    if(page>1){
      setPage(prev=>prev-1)
    }
  }

  const nextPageHandler = () => {
    if(page<pages){
      setPage(prev=>prev+1)
    }
  }
  return (
    <Container fluid style={{paddingTop:'5rem'}}> 
          <Features setShowLeader = {setShowLeader} setLeaderData = {setLeaderData} setShowReport={setShowReport}/>
          <LeaderBoard showLeader={showLeader} setShowLeader={setShowLeader} leaderData = {leaderData}/>
          {!showReport?
            <>
            <Row>
              <Col xs lg="6" className='mx-auto'>
                <ExpenseForm setLoad = {setLoad} edited={edited} setEdited = {setEdited}/>
              </Col>
            </Row>
            {loading&&<Loader className='my-3 mx-auto'/>}
            <Row>
              <Col xs lg="8" className='mx-auto'>
               <ExpenseList expenses={expenses} setLoad = {setLoad} setEdited={setEdited} setExpenses = {setExpenses}/>
               <Pagination className='mx-auto fw-bold w-50 text-success'>
                  <div className="d-flex mx-auto">
                    <Pagination.Prev onClick={prevPageHandler}/>
                    <Pagination.Item onClick={(e)=>{setPage(e.currentTarget.innerHTML)}}>{1}</Pagination.Item>
                    <Pagination.Ellipsis/>
                    <Pagination.Item onClick={(e)=>{setPage(e.currentTarget.innerHTML)}}>{pages}</Pagination.Item>
                    <Pagination.Next onClick={nextPageHandler}/>
                  </div>
               </Pagination>
              </Col>
            </Row>
            </>
            :
            <ExpenseReport setShowReport = {setShowReport}/>
          }
    </Container>
  )
}

export default Expenses;