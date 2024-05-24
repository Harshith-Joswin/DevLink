// import { Route, Navigate } from "react-router-dom";

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const isAuthenticated = localStorage.getItem('devlinktoken');

//   return (
//     <Route
//       {...rest}
//       render={props =>
//         isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Navigate to="/" />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;

import { Navigate, Outlet} from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("devlinktoken");
//   console.log(isAuthenticated)
  return isAuthenticated ? <Outlet/> : <Navigate to="/login"/>
};

export default PrivateRoute;