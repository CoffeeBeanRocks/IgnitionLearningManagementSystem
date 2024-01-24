import { Navigate, Outlet } from "react-router-dom";

const LockedRoute = ({user}) => {
  return user? <Outlet /> : <Navigate to={"/login"} replace />;
};

export default LockedRoute;