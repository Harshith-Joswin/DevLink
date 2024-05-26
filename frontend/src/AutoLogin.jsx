import { Navigate, Outlet} from "react-router-dom";

const AutoLogin = () => {
  const isAuthenticated = localStorage.getItem("devlinktoken");
  return isAuthenticated ?  <Navigate to="/feed"/> :<Outlet/> ;
};

export default AutoLogin;