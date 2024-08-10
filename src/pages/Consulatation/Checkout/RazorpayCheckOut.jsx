import { Button } from '@chakra-ui/react';
import { useUser } from '../../../contexts/userContext';
import { useNavigate } from 'react-router-dom';

const RazorpayCheckout = () => {
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
        alert(`Payment successful: ${response.razorpay_payment_id}`);
        console.log(`Payment successful: ${response.razorpay}`);
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
    <div>
      <Button variant={'solid'} colorScheme='teal' onClick={handlePayment}>Pay &#8377;200 and Proceed to TeleChat!</Button>
    </div>
  );
};

export default RazorpayCheckout;