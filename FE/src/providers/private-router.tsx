import { Loader } from "@/components";
import { useVerifyToken } from "@/hooks";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useVerifyToken();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
