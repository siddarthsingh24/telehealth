import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaMicrophone } from "react-icons/fa";
import { Button, Input } from "@chakra-ui/react";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import CountdownTimer from "./CountDownTimer";
import { useNavigate } from "react-router-dom";
import {db} from '../../../config/firebase'
import { useAuth } from "../../../contexts/AuthContext";
import { updateDoc } from "firebase/firestore";

const Chat = () => {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [listening, setListening] = useState(false);
	const chatEndRef = useRef(null);
	const { transcript } = useSpeechRecognition();
	const navigate = useNavigate();
  const {currentUser}=useAuth();
	// Predefined responses for common medical queries
	const predefinedResponses = {
		headache:
			"For a headache, ensure you're hydrated and consider resting in a quiet, dark room. If the headache persists or is severe, consult a healthcare provider.",
		fever:
			"If you have a fever, rest and stay hydrated. You may use over-the-counter medications like acetaminophen or ibuprofen to manage your symptoms. If the fever lasts more than a few days or is very high, seek medical advice.",
		// Add more predefined responses based on common symptoms or questions
	};

	const getTranscript = () => {
		if (listening) {
			SpeechRecognition.stopListening();
			setListening(false);
			handleSubmit();
		} else {
			SpeechRecognition.startListening();
			setListening(true);
		}
	};

	const handleSubmit = async (e) => {
		e?.preventDefault();
		if (!input.trim()) return;

		// Check for predefined responses
		const lowercasedInput = input.toLowerCase();
		const predefinedResponse = Object.keys(predefinedResponses).find((key) =>
			lowercasedInput.includes(key)
		);

		if (predefinedResponse) {
			setMessages([
				...messages,
				{ text: input, type: "user" },
				{ text: predefinedResponses[predefinedResponse], type: "bot" },
			]);
			setInput("");
			return;
		}

		// Default prompt with role description
		const prompt = `You are Doctor, a healthcare consultant. A patient is asking: "${input}". Please respond like a doctor and suggest medications and suggestions. Don't ask many questions and conclude the chat after 10 conversations by suggesting medicines at last. Don't say that you are an AI, act like a doctor.`;

		setMessages([...messages, { text: input, type: "user" }]);
		setInput("");
		setLoading(true);

		try {
			const response = await axios.post(
				"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBYHQjXv9aE6Juxfa3srSJ0lGm_KkUEmpI",
				{
					contents: [
						{
							parts: [
								{
									text: prompt,
								},
							],
						},
					],
				}
			);

			if (response.data.candidates && response.data.candidates.length > 0) {
				const botMessage = response.data.candidates[0].content.parts[0].text;

				setMessages([
					...messages,
					{ text: input, type: "user" },
					{ text: botMessage, type: "bot" },
				]);
			} else {
				setMessages([
					...messages,
					{ text: input, type: "user" },
					{ text: "No response from bot", type: "bot" },
				]);
			}
		} catch (error) {
			console.error("Error fetching response:", error);
			setMessages([
				...messages,
				{ text: "Error fetching response", type: "bot" },
			]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		(async () => {
			if (messages.length > 0 && !messages[0].timestamp) {
				const timestamp = new Date();
				setMessages([
					...messages.map((message, index) =>
						index === 0 ? { ...message, timestamp } : message
					),
				]);

				// Send the timestamp to the database
				// db.collection("messages").add({
				//   timestamp: timestamp,
				// })
				await updateDoc(db, "Users",currentUser?.id,{
          firstMessageTimestamp: timestamp,
        })
					.then(() => {
						console.log("Timestamp sent to the database");
					})
					.catch((error) => {
						console.error("Error sending timestamp to the database:", error);
					});
			}
		})();
	}, [messages]);
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		setInput(transcript);
	}, [transcript]);

  useEffect(()=>{
    
  },[])
	return (
		<>
			<div className="w-[80vw] h-[80%] overflow-y-hidden overflow-scroll mx-auto py-2 border rounded-lg shadow-lg absolute bg-black/10">
				<div className="chat-messages h-[92%] rounded-xl p-4 w-full space-y-4 mb-4 overflow-y-scroll overflow-scroll px-2">
					{messages.map((message, index) => (
						<div
							key={index}
							className={`message p-2 border rounded-lg ${
								message.type === "user"
									? "bg-teal-500 text-white self-end"
									: "bg-gray-200 text-black self-start"
							}`}>
							{message.text}
						</div>
					))}
					{loading && (
						<div className="message p-2 rounded-lg bg-gray-200 text-black">
							Loading...
						</div>
					)}
					<div ref={chatEndRef} />
				</div>
				<form
					onSubmit={handleSubmit}
					className="flex absolute bottom-1 w-full px-2 gap-3">
					<Input
						borderColor={"green.500"}
						focusBorderColor="teal.500"
						type="text"
						variant={"filled"}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type a message..."
						className="flex-grow p-2 border border-teal-700 rounded-lg"
					/>
					<Button
						type="submit"
						colorScheme={"teal"}>
						Send
					</Button>
					<Button
						variant={listening ? "solid" : "outline"}
						colorScheme={listening ? "red" : "green"}
						className="p-2 rounded-full"
						onClick={() => {
							getTranscript();
						}}>
						<FaMicrophone />
					</Button>
				</form>
			</div>
			<div className="absolute bottom-0 left-0">
				<CountdownTimer
					initialSeconds={"60"}
					onCountdownEnd={() => {
						alert("TIMES UP");
						setTimeout(() => {
							navigate("/consultation");
						}, 1000);
					}}
				/>
			</div>
		</>
	);
};

export default Chat;
