import AuthContext from "@/context/auth-context";
import { useContext, useDebugValue } from "react";

const useAuth = () => {
    const { auth } = useContext(AuthContext);
    useDebugValue(auth, auth => auth ? "Logged In" : "Logged Out")
    return useContext(AuthContext);

}

export default useAuth;