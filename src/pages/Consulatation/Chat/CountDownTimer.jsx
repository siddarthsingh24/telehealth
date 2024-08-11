/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const CountdownTimer = ({ initialSeconds,onCountdownEnd }) => {

	const [seconds, setSeconds] = useState(Math.trunc(initialSeconds));
	useEffect(()=>{
		console.log(initialSeconds);
		
	},[])
	useEffect(() => {
		console.log(seconds);
		// Exit early if countdown is finished
		if (seconds <= 0) {
            onCountdownEnd();
			return;
		}

		// Set up the timer
		const timer = setInterval(() => {
			setSeconds((prevSeconds) => prevSeconds - 1);
		}, 1000);

		// Clean up the timer
		return () => clearInterval(timer);
	}, [seconds]);

	// Format the remaining time (e.g., “00:05:10” for 5 minutes and 10 seconds)
	const formatTime = (timeInSeconds) => {
		const minutes = Math.floor(timeInSeconds / 60)
			.toString()
			.padStart(2, `0`);
		const seconds = (timeInSeconds % 60).toString().padStart(2, `0`);
		return `${minutes}:${seconds}`;
	};

	return (
		<div className="bg-red-500 text-white rounded-xl px-3 m-1 flex items-center flex-col">
            <h1 className="font-poppins font-medium">Time Remaning:</h1>
			<p>{formatTime(seconds)}</p>

		</div>
	);
};

export default CountdownTimer;
