import { useLocation, Navigate, Outlet } from "react-router-dom";
import isTokenExpired from "../hooks/verifyToken";

const RequireAuth = () => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const tokenRes = isTokenExpired(token)
    return (
        !tokenRes ? <Outlet /> 
        : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;