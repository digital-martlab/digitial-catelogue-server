import useAuth from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import AdminLayout from "@/layouts/admin-layout";
import { ROLES } from "@/lib/roles";
import { getThemeFn } from "@/services/admin/theme-service";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { WindowLoading } from "./loading-spinner";

const RequireAuth = ({ allowedRoles }) => {
    const [themeLoading, setThemeLoading] = useState(true);
    const { setTheme, setColor } = useTheme();
    const { auth, authLoading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (auth?.role === ROLES.ADMIN) {
            setThemeLoading(true);
            getThemeFn()
                .then(({ data }) => {
                    if (data) {
                        setColor(data?.theme_color);
                        setTheme(data?.theme_mod);
                    }
                })
                .catch((error) => console.error("Failed to load theme:", error))
                .finally(() => {
                    setThemeLoading(false);
                });
        } else {
            setThemeLoading(false);
        }
    }, [auth?.role, setColor, setTheme]);

    if (authLoading || themeLoading) {
        return <WindowLoading />;
    }

    return (
        allowedRoles.includes(auth?.role) ? (
            <AdminLayout />
        ) : auth?.user_name || auth?.name ? (
            <Navigate to="/" state={{ from: location }} replace />
        ) : (
            <Navigate to="/admin/login" state={{ from: location }} replace />
        )
    );
};

export default RequireAuth;
