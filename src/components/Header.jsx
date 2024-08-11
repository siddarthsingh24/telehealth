import { useEffect, useState } from "react";
import { useUser } from "../contexts/userContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MdLocalHospital } from "react-icons/md";
import { IoGrid } from "react-icons/io5";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";

const Header = () => {
  const [signingOut, setSigningOut] = useState(false);
	const navigate = useNavigate();
  
	const { user, setUser } = useUser();
  const {currentUser}=useAuth();

  useEffect(() => {
   if(currentUser) { 
    const loadUser = async ()=>{
      const userRef = doc(db, "Users", currentUser?.uid);
      const userSnap = await getDoc(userRef);
      setUser(userSnap.data());
    }
    loadUser();
  }
  }, [currentUser])
  
	return (
		<div className="fixed top-0 bg-teal-400/20 w-full h-[5vh] flex items-center justify-between px-[5vw] py-[3vh] z-30">
			<div className="flex items-center gap-1 text-2xl font-nun font-black select-none cursor-pointer" onClick={()=>{navigate("/")}}>
        <MdLocalHospital/>
        TeleDoc
      </div>

      <Flex alignItems={"center"} justifyContent={"center"} gap={"1vw"}>
        <div>
          {user ? (
            <div className="flex items-center gap-3 select-none font-semibold">
              {user.displayName}
              <Button
                colorScheme={signingOut ? "orange" : "red"}
                rightIcon={!signingOut&&<FaSignOutAlt/>}
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
              rightIcon={<FaSignInAlt/>}
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
