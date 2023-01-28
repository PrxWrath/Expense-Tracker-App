import axios from 'axios'
import React from 'react'
import { Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../store/AuthReducer';

const Features = (props) => {
    const token = useSelector(state=>state.auth.loginToken);
    const isPremium = useSelector(state=>state.auth.premiumUser);
    const dispatch = useDispatch();

    //call razorpay and make changes in backend
    const buyPremiumHandler = async() => {
        try{
            const res = await axios.get('http://localhost:4000/purchase/purchase-premium', {headers: {
                'Authorization' : token
              }})

            if(res.status===201){
                const options = {
                    key: res.data.key_id,
                    name: "Expense Tracker Premium",
                    order_id: res.data.order.id,
                    handler: async (response) => {
                      try {
                       const payment_Id = !response? null : response.razorpay_payment_id;
                       if(response){
                            dispatch(authActions.activatePremium()) //make premium user when payment succeeds
                       }
                       const url = 'http://localhost:4000/purchase/update-status'  //update status upon successfull payment
                        await axios.post(url, {
                            order_Id: options.order_id,
                            payment_Id
                        },{headers: {'Authorization' : token}});
                        
                        }catch (err) {
                        console.log(err);
                      }
                    },
                    theme: {
                      color: "#686CFD",
                    },
                  };
                const rzp1 = new window.Razorpay(options);
                rzp1.open();  
            }
        }catch(err){
            console.log('Something went wrong!')
        }
    }

    //load leaderboard data and toggle display
    const leaderBoardToggle = async() => {
        try{
            const res = await axios.get('http://localhost:4000/premium/show-leaders');
            if(res.status === 201){
                props.setLeaderData(res.data.leaders);
                props.setShowLeader(prev=>!prev);
            }
        }catch(err){
            console.log('Something went wrong!')
        }
    }
    
    //toggle report display
    const reportToggle = () => {
        props.setShowReport(prev=>!prev)
    }

    return (
    <Container className='p-1 border-bottom border-secondary d-flex justify-content-between'>
        {!isPremium?<Button onClick={buyPremiumHandler} id="rzp-button1" variant='dark' className='text-warning ms-auto'>
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="goldenrod" className="mx-1 bi bi-star-fill" viewBox="0 0 17 17">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
            Buy Premium  
        </Button>
        :
        <>
        <Button onClick={leaderBoardToggle} className='fw-bold p-2 mx-2' style={{maxHeight:'3.5rem', width:'10rem'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 bi bi-bar-chart-fill" viewBox="0 0 16 16">
                <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z"/>
            </svg>
            Leaderboard
        </Button>
        <Button onClick={reportToggle} variant="danger" className="me-auto" style={{maxHeight:'3.5rem', width:'10rem'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 bi bi-file-earmark-medical-fill" viewBox="0 0 16 16">
                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm-3 2v.634l.549-.317a.5.5 0 1 1 .5.866L7 7l.549.317a.5.5 0 1 1-.5.866L6.5 7.866V8.5a.5.5 0 0 1-1 0v-.634l-.549.317a.5.5 0 1 1-.5-.866L5 7l-.549-.317a.5.5 0 0 1 .5-.866l.549.317V5.5a.5.5 0 1 1 1 0zm-2 4.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm0 2h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1z"/>
            </svg>
            Report
        </Button>
        </>
        }
    </Container>
  )
}

export default Features