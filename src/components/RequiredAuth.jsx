import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/use-auth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth, authLoading } = useAuth();
    const location = useLocation();

    if (authLoading) {
        return <div className="h-screen bg-background w-full">Loading...</div>;
    }

    return (
        allowedRoles.includes(auth?.role)
            ? <Outlet />
            : auth?.user_name || auth?.name
                ? <Navigate to="/" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;
