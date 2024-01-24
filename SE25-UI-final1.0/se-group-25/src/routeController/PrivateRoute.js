import { Navigate, Outlet } from "react-router-dom";
import Unapproved from "../components/Unapproved";

const PrivateRoute = ({user,setLoggedInUser}) => {
  return user ? user.type != 'Unapproved' ? <Outlet /> : <Unapproved  setLoggedInUser={setLoggedInUser}/> :<Navigate to={"/login"} replace />;
};

export default PrivateRoute;