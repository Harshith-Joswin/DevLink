import { Navigate, Outlet} from "react-router-dom";

const ProctectLogin = () => {
  const isAuthenticated = localStorage.getItem("devlinktoken");
  return isAuthenticated ?  <Navigate to="/feed"/> :<Outlet/> ;
};

export default ProctectLogin;