import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { JSX } from "react";

const IfLoggedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const user = useUserStore((state) => state.user);

  return !user ? children : <Navigate to="/" replace />;
};

export default IfLoggedRoute;
