import { Navigate, Outlet} from "react-router-dom";

// Function to auto login if the auth_token exists
const AutoLogin = () => {
  const isAuthenticated = localStorage.getItem("devlinktoken");
  return isAuthenticated ?  <Navigate to="/feed"/> :<Outlet/> ;
};

export default AutoLogin;