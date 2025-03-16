import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { JSX } from "react";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const user = useUserStore((state) => state.user);

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
