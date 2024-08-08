/* eslint-disable react/prop-types */
import {
	FormControl,
	Input
} from "@chakra-ui/react";
import { useState } from "react";

const InputField = ({type,setter}) => {
	const [input, setInput] = useState("");
	const handleInputChange = (e) => {setInput(e.target.value)
        setter(e.target.value)
    }
	const TYPE = type=="Confirm Password"||type=="Password"?"password":"text";
	return (
        <FormControl>
			<Input
				borderColor={"green.500"}
				focusBorderColor='green.700'
				type={TYPE}
				variant="flushed"
				value={input}
				placeholder={"Enter "+type}
				onChange={handleInputChange}
				_placeholder={{ color: 'blue.900',opacity:0.3 }}
                />
		</FormControl>
	);
};

export default InputField;
