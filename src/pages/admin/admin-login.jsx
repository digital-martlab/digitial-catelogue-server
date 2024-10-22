import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/use-auth";
import { showAlert } from "@/lib/catch-async-api";
import { ROLES } from "@/lib/roles";
import { loginAdminFn } from "@/services/admin/login-service";
import { loginSuperAdminFn } from "@/services/super-admin/login-service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { setAuthFn, auth, authLoading } = useAuth();
    const [storeId, setStoreId] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!storeId || !password) {
            return showAlert({ message: "Store ID and password are required." }, true);
        }

        const data = await loginAdminFn({
            store_id: storeId,
            password
        });
        showAlert(data);
        if (data?.data?.token) {
            setAuthFn(data?.data?.token);
            navigate("/admin/");
        }
    };

    useEffect(() => {
        // if (auth && !authLoading) {
        //     if (auth?.role === ROLES.ADMIN)
        //         navigate("/admin/")
        //     else
        //         navigate("/super-admin/")
        // }

        return () => {
            setStoreId("");
            setPassword("");
        };
    }, [navigate, auth, authLoading]);

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>

                <div className="mb-4 space-y-2">
                    <Label htmlFor="store-id" className="block mb-1 font-medium">
                        Store ID
                    </Label>
                    <Input
                        type="text"
                        id="store-id"
                        value={storeId}
                        onChange={(e) => setStoreId(e.target.value)}
                        placeholder="Enter Store ID"
                        required
                    />
                </div>

                <div className="mb-6 space-y-2">
                    <Label htmlFor="password" className="block mb-1 font-medium">
                        Password
                    </Label>
                    <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                    />
                </div>

                <Button type="submit" className="w-full" size="sm">
                    Login
                </Button>
            </form>
        </div>
    );
}
