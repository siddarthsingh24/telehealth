import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
	Elements,
	CardElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import { db } from "../../../config/firebase";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Alert,
	AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import RazorpayCheckout from "./RazorpayCheckOut";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const PaymentForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const nav = useNavigate();
	const { currentUser } = useAuth();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setProcessing(true);
		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: "card",
			card: elements.getElement(CardElement),
		});

		if (error) {
			setError(`Payment failed: ${error.message}`);
			setProcessing(false);
		} else {
			setError(null);
			setSuccess(true);
			console.log("PaymentMethod:", paymentMethod);
			

			const userRef = doc(db, "Users", currentUser?.uid);
			const paymentTimestamp = new Date();
			await updateDoc(userRef,{
				paymentTimestamp: paymentTimestamp,
				paymentDone:true,
			}).then(() => {
                nav("/chat");
            })
		}
	};
	const handleChange = (event) => {
		setDisabled(event.empty);
		setError(event.error ? event.error.message : "");
	};
	return (
		<Box
			width="50%"
			mx="auto"
			p="6"
			border="0.1px"
			shadow="md"
			className="text-teal-700 bg-teal-500/10 rounded-xl space-y-4 p-2">
			<Box
				textAlign="center"
				mb="4">
				<Box
					as="h2"
					fontSize="2xl"
					fontWeight="semibold">
					Complete Payment to Proceed to Chat
				</Box>
			</Box>
			<form onSubmit={handleSubmit}>
				<FormControl mb="4">
					<FormLabel>Card Details</FormLabel>
					<CardElement
						onChange={handleChange}
						options={{ style: { base: { fontSize: "16px" } } }}
						className="p-3 border border-teal-300 rounded-md"
					/>
				</FormControl>
				<Button
					type="submit"
					colorScheme="teal"
					size="lg"
					width="full"
					disabled={processing || disabled || success}
					id="submit">
					<span id="button-text">
						{processing ? (
							<div
								className="spinner"
								id="spinner"></div>
						) : (
							`Pay ₹ 200 and Proceed to TeleChat!`
						)}
					</span>
				</Button>
				{error && (
					<div
						className="card-error"
						role="alert">
						{error}
					</div>
				)}
				{/* <Button
					type="submit"
					disabled={!stripe}
					colorScheme="teal"
					size="lg"
					width="full"
					onClick={() => {
						// nav("/chat");
					}}>
					Pay &#8377;200 and Proceed to TeleChat!
				</Button> */}
			</form>
			{error && (
				<Alert
					status="error"
					mt="4">
					<AlertIcon />
					Error: {error}
				</Alert>
			)}
			{success && (
				<Alert
					status="success"
					mt="4">
					<AlertIcon />
					Payment Successful!
				</Alert>
			)}
		</Box>
	);
};

const CheckOut = () => (
	<Elements stripe={stripePromise}>
		<PaymentForm />
	</Elements>
);

export default CheckOut;
