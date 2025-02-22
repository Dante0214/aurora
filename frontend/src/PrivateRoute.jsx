import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // 토큰이 있는지 확인

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
