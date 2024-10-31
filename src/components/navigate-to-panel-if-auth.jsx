import useAuth from "@/hooks/use-auth";
import { ROLES } from "@/lib/roles";
import { Navigate, Outlet } from "react-router-dom";
import { WindowLoading } from "./loading-spinner";

export default function PanelNavigationIfAuth() {
    const { auth, authLoading } = useAuth();

    if (authLoading)
        return <WindowLoading />;

    return auth
        ? auth?.role === ROLES.ADMIN
            ? <Navigate to="/admin/" replace />
            : <Navigate to="/super-admin/" replace />
        : <Outlet />
    // return <Outlet />
} 