import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AdminLayout from "@/layouts/admin-layout";
import { ROLES } from "@/lib/roles";
import { getThemeFn } from "@/services/admin/theme-service";
import useAuth from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { WindowLoading } from "./loading-spinner";

const RequireAuth = ({ allowedRoles }) => {
    const [themeLoading, setThemeLoading] = useState(true);
    const { setTheme, setColor } = useTheme();
    const { auth, authLoading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const loadTheme = async () => {
            try {
                if (auth?.role === ROLES.ADMIN) {
                    setThemeLoading(true);
                    const { data } = await getThemeFn();
                    if (data) {
                        setColor(data.theme_color);
                        setTheme(data.theme_mod);
                    }
                }
            } catch (error) {
                console.error("Failed to load theme:", error);
            } finally {
                setThemeLoading(false);
            }
        };

        loadTheme();
    }, [auth?.role, setColor, setTheme]);

    if (authLoading || themeLoading) {
        return <WindowLoading />;
    }

    if (allowedRoles.includes(auth?.role)) {
        return <AdminLayout />;
    }

    const redirectPath = window.location.href.includes('super-admin') ? "/super-admin/login" : "/admin/login";
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
};

export default RequireAuth;
