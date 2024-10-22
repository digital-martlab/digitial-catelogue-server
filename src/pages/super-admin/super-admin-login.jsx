import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/use-auth";
import { showAlert } from "@/lib/catch-async-api";
import { ROLES } from "@/lib/roles";
import { loginSuperAdminFn } from "@/services/super-admin/login-service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const { setAuthFn, auth, authLoading } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !password)
      return showAlert({ message: "username and password is required." }, true);

    const data = await loginSuperAdminFn({
      user_name: userName,
      password
    })
    showAlert(data);
    localStorage.setItem("digital_martlab_token", data?.data?.token);
    setAuthFn(data?.data?.token)
    navigate("/super-admin/")
  };

  useEffect(() => {
    if (auth && !authLoading) {
      if (auth?.role === ROLES.SUPER_ADMIN)
        navigate("/super-admin/")
      else
        navigate("/admin/")
    }

    return () => {
      setUserName("");
      setPassword("");
    }
  }, [auth, authLoading, navigate])

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Super Admin Login</h2>

        <div className="mb-4 space-y-2">
          <Label htmlFor="username" className="block mb-1 font-medium">
            Username
          </Label>
          <Input
            type="text"
            id="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter username"
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
