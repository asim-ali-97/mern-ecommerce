import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
function CustomerRoute() {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo?.isAdmin ? <Navigate to="/" replace /> : <Outlet />;
}

export default CustomerRoute;
