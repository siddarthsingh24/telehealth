import { useState } from "react";
import { useUser } from "../contexts/userContext";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MdDashboard, MdLocalHospital } from "react-icons/md";
import { IoGrid } from "react-icons/io5";

const Header = () => {
	const { user, setUser } = useUser();
	const [signingOut, setSigningOut] = useState(false);
	const navigate = useNavigate();
	return (
		<div className="fixed top-0 bg-teal-400/20 w-full h-[5vh] flex items-center justify-between px-[5vw] py-[3vh] z-30">
			<div className="flex items-center gap-1 text-xl font-nun font-black select-none cursor-pointer" onClick={()=>{navigate("/")}}>
        <MdLocalHospital/>
        TeleDoc
      </div>

      <Flex alignItems={"center"} justifyContent={"center"} gap={"1vw"}>
        <div className="p-2 hover:bg-teal-900/20 rounded-full cursor-pointer transition-all duration-200">
          <IoGrid/>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3 select-none font-semibold">
              {user.displayName}
              <Button
                colorScheme={signingOut ? "orange" : "red"}
                onClick={() => {
                  signOut(auth);
                  setSigningOut(true);
                  setTimeout(() => {
                    setUser(null);
                    setSigningOut(false);
                  }, 2000);
                  navigate("/");
                }}>
                {signingOut ? "Signing Out" : "Sign Out"}
              </Button>
            </div>
          ) : (
            <Button
              colorScheme="teal"
              rightIcon={<MdDashboard />}
              onClick={() => {
                navigate("/signin");
              }}>
              SignIn
            </Button>
          )}
        </div>
      </Flex>
		</div>
	);
};

export default Header;
