import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ROLES } from "@/lib/roles";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    function setAuthFn(token) {
        localStorage.setItem("digital_catelogue_app_token", token);
        setAuth(jwtDecode(token));
        setAuthLoading(false);
    }

    function logoutFn() {
        localStorage.removeItem("digital_catelogue_app_token");
        setAuth(null);
        setAuthLoading(false);
        if (auth?.role === ROLES.SUPER_ADMIN) {
            navigate("/super-admin/login");
        } else {
            navigate("/admin/login");
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("digital_catelogue_app_token");
        if (token) {
            setAuthFn(token);
        } else {
            setAuthLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, logoutFn, setAuthFn, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
