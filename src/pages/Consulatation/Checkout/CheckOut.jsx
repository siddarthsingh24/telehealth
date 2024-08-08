import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
	Elements,
	CardElement,
	useStripe,
	useElements,
} from "@stripe/react-stripe-js";
import { functions } from "../../../config/firebase";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Select,
	Alert,
	AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const PaymentForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const [cardType, setCardType] = useState("");
	const nav = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		const cardElement = elements.getElement(CardElement);

		const { error: stripeError, paymentMethod } =
			await stripe.createPaymentMethod({
				type: "card",
				card: cardElement,
			});

		if (stripeError) {
			setError(stripeError.message);
		} else {
			setError(null);
			const { id } = paymentMethod;

			const createPaymentIntent = functions.httpsCallable(
				"createPaymentIntent"
			);
			try {
				const result = await createPaymentIntent({
					payment_method_id: id,
					amount: 200,
				});

				if (result.data.success) {
					setSuccess(true);
				} else {
					setError(result.data.error);
				}
			} catch (error) {
				setError(error.message);
			}
		}
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
					<FormLabel>Card Type</FormLabel>
					<Select
						value={cardType}
						onChange={(e) => setCardType(e.target.value)}
						placeholder="Select Card Type"
						variant={"filled"}
						borderColor="teal.300">
						<option value="debit">Debit Card</option>
						<option value="credit">Credit Card</option>
					</Select>
				</FormControl>
				<FormControl mb="4">
					<FormLabel>Card Details</FormLabel>
					<CardElement
						options={{ style: { base: { fontSize: "16px" } } }}
						className="p-3 border border-teal-300 rounded-md"
					/>
				</FormControl>
				<Button
					type="submit"
					disabled={!stripe}
					colorScheme="teal"
					size="lg"
					width="full"
					onClick={() => {
						nav("/chat");
					}}>
					Pay &#8377;200 and Proceed to TeleChat!
				</Button>
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
