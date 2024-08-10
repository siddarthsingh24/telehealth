/* eslint-disable react/prop-types */
import { Button } from '@chakra-ui/react';
import { useUser } from '../../../contexts/userContext';
import { useNavigate } from 'react-router-dom';

const RazorpayCheckout = ({filled,paymentFunction}) => {
  const {user}=useUser();
  const nav = useNavigate();
  const handlePayment = () => {
    const options = {
      key: 'rzp_test_8CZ2uFiU8B2sbz', 
      amount: '20000', 
      currency: 'INR',
      name: 'Teleheath',
      description: 'Test Transaction',
      handler: function (response) {
        console.log(`Payment successful: ${response.razorpay}`);
        paymentFunction(true);
        // Save the payment details to the database
        

        nav("/chat")
        
      },
      prefill: {
        name: user?.displayName,
        email: user?.email
      },
      theme: {
        color: '#9EEAE4'
      }
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <>
      <Button type='submit' variant={'solid'} width={'100%'} colorScheme='teal' onClick={()=>{
        if (filled) {
          handlePayment()
        }
        }}>Submit and Pay Fee</Button>
    </>
  );
};

export default RazorpayCheckout;