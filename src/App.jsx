import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth/Auth";
import Background from "./components/Background";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/userContext";
import Consultation from "./pages/Consulatation/Consultation";
import ErrorPage from "./pages/ErrorPage";
import Header from "./components/Header";
import Chat from "./pages/Consulatation/Chat/Chat";
import RazorpayCheckout from "./pages/Consulatation/Checkout/RazorpayCheckOut";

function App() {
	return (
		<>
			<Background>
				<AuthProvider>
					<UserProvider>
						<div className="h-screen w-screen absolute z-20 flex items-center justify-center">
							<Header/>
							<Routes>
								<Route
									path="/"
									element={<Home />}
								/>
								<Route
									path="/signin"
									element={<Auth />}
								/>
								<Route
									path="/consultation"
									element={<Consultation/>}
								/>
								<Route
									path="/pay"
									element={<RazorpayCheckout/>}
								/>
								<Route
									path="/chat"
									element={<Chat/>}
								/>
								<Route path="*" element={<ErrorPage />} />
							</Routes>
						</div>
					</UserProvider>
				</AuthProvider>
			</Background>
		</>
	);
}

export default App;
