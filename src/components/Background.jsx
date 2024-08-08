/* eslint-disable react/prop-types */
import { useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";

const Background = ({ children }) => {
	const { colorMode, setColorMode } = useColorMode();
	useEffect(() => {
		setColorMode("light");
	}, []);
	return (
		<div
			className={`fixed h-screen w-full text-teal-900 -z-10 ${
				colorMode == "light" ? "bg-teal-300/20" : "bg-black"
			}`}>
			<div className="z-10 absolute  blur-3xl -right-56 top-80 bg-teal-400/10 rounded-full h-[1100px] w-[800px] animate-spin-slow hover:bg-cyan-600/15 duration-1000"></div>
			<div className="z-10 absolute  blur-3xl -left-56 -top-80 bg-cyan-400/20 rounded-full h-[1000px] w-[800px] animate-spin-slow hover:bg-cyan-600/15 duration-1000">
				<div className="z-10 absolute  blur-3xl left-5 top-72 bg-teal-400/20 rounded-full h-[900px] w-[800px] animate- hover:bg-teal-600/15 duration-1000"></div>
			</div>
			<div className="z-20 absolute">{children}</div>
		</div>
	);
};

export default Background;
