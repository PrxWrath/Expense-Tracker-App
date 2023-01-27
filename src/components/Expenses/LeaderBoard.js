import React from 'react'
import { ListGroupItem, Modal } from 'react-bootstrap'

const LeaderBoard = (props) => {
  
    const handleHideLeaders = () => {
        props.setShowLeader(false);
    }

  return (
    <Modal 
        show={props.showLeader}
        onHide={handleHideLeaders}
        className="mx-auto w-100 my-5"
        backdrop="static"
    >
        <Modal.Header closeButton className='bg-success text-light'>
            <Modal.Title>Expense Leaderboard</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {props.leaderData?Object.values(props.leaderData).map((user,index)=>{
                return(
                    <ListGroupItem className="d-flex justify-content-between fw-bold border-bottom border-success p-1" key={user.userId}>
                        <h5 className={`w-25 ${index===0? 'text-danger fs-4':''}`}>{index+1}.</h5>
                        <h5 className='w-50'>{user.name}</h5>
                        <h5 className='w-25 text-center text-success'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-rupee" viewBox="0 0 16 16">
                            <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                        </svg>
                            {user.total?user.total:0}
                        </h5>
                    </ListGroupItem>
                )
            }):<></>}
        </Modal.Body>
    </Modal>
  )
}

export default LeaderBoard