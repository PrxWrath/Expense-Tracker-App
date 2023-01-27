import axios from 'axios'
import React from 'react'
import { Button, Container, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../store/AuthReducer';

const Features = () => {
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
            console.log(err)
        }
    }

    
    return (
    <Container className='p-1 border-bottom border-secondary d-flex justify-content-end'>
        {!isPremium?<Button onClick={buyPremiumHandler} id="rzp-button1" variant='dark' className='text-warning ms-auto'>
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="goldenrod" className="mx-1 bi bi-star-fill" viewBox="0 0 17 17">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
            Buy Premium  
        </Button>
        :
        <Alert variant='warning' className="w-25 text-center">Premium Activated</Alert>
        }
    </Container>
  )
}

export default Features