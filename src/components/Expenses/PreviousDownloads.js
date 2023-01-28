import React from 'react'
import { Modal, ListGroupItem } from 'react-bootstrap';

const PreviousDownloads = (props) => {
    
    const handleHideDownloads = () => {
        props.setShowDownloads(false);
    }

  return (
    <Modal 
        show={props.showDownloads}
        onHide={handleHideDownloads}
        className="mx-auto w-100 my-5"
        
    >
        <Modal.Header closeButton className='bg-success text-light'>
            <Modal.Title>Previous Downloads</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {props.downloads?Object.values(props.downloads).map((download,index)=>{
                return(
                    <ListGroupItem className="d-flex justify-content-between fw-bold border-bottom border-success p-1" key={download.id}>
                        <h5 className="w-25 ">{new Date(download.updatedAt).toLocaleString("en-Us", {month:'2-digit', day:'2-digit', year:'numeric'})}</h5>
                        <h5 className='w-50'><a href={download.url} download="MyExpenses.csv">Download Again</a></h5>
                    </ListGroupItem>
                )
            }):<></>}
        </Modal.Body>
    </Modal>
  )
}

export default PreviousDownloads