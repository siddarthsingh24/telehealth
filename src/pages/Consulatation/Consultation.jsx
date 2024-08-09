import { useState } from "react";
import InputField from "./components/InputField";
import {
	Button,
	Select,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


const Consultation = () => {
	const [name, setName] = useState();
	const [age, setAge] = useState();
	const [speciality, setSpeciality] = useState("");
	const [gender, setGender] = useState("");
	const nav = useNavigate();
	const submitPatientForm = (e) => {
		e.preventDefault();
		console.log(name, age, speciality,gender);
	};
	return (
		<div className="bg-teal-500/20 text-teal-900 rounded-xl space-y-4 p-2 shadow-md">
			<form
				onSubmit={submitPatientForm}
				className="space-y-4 p-3">
				<span className="font-bold font-poppins">
					Fill this form to begin
				</span>
				<InputField
					type={"Name"}
					setter={setName}
				/>
				<div className="flex items-center gap-3">
					<div className="w-1/2">
						<Select
							onChange={(e) => setGender(e.target.value)}
							placeholder="Gender"
							variant={"filled"}
							borderColor="green.500">
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</Select>
					</div>
					<div className="">
						<InputField
							type={"Age"}
							setter={setAge}
						/>
					</div>
					<Select
						onChange={(e) => setSpeciality(e.target.value)}
						placeholder="Consultation Speciality"
						variant={"filled"}
						borderColor="green.500">
						{["Heart", "Kidney", "General", "ENT", "Child"].map((spec) => {
							return (
								<option
									key={spec}
									value={spec}>
									{spec}
								</option>
							);
						})}
					</Select>
				</div>
				<Button
					type="submit"
					colorScheme="teal"
					className="w-full"
					onClick={() => {
						if (name && age && gender && speciality) {
							nav("/pay");
						} else {
							alert("Please fill all fields");
						}
					}}>
					Proceed to Consulatation
				</Button>
			</form>
		</div>
	);
};

export default Consultation;
