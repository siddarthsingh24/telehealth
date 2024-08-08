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
	return (
        <FormControl>
			<Input
				borderColor={"green.500"}
				focusBorderColor='green.700'
				type={type=="Age"?"number":"text"}
				variant="filled"
				value={input}
				placeholder={type}
				onChange={handleInputChange}
				_placeholder={{ color: 'green.700', opacity:0.7}}
                />
		</FormControl>
	);
};

export default InputField;
