import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Title from "../ui/title";
import { showAlert } from "@/lib/catch-async-api";
import { passwordChangeAdminFn } from "@/services/admin/change-password-service";

export default function AdminPasswordChange() {
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleSubmit = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showAlert({ message: "All fields are required." });
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert({ message: "New password and confirm password do not match." });
            return;
        }

        setLoading(true);
        passwordChangeAdminFn({
            current_password: currentPassword,
            new_password: newPassword,
            confirm_new_password: confirmPassword
        }).then((data) => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            showAlert(data);
        }).finally(() => setLoading(false));
    };

    return (
        <>
            <Title title={"Change Password"} />
            <div className="grid mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <Label className="mb-2" htmlFor="current-password">Current Password</Label>
                    <Input
                        type="password"
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Label className="mb-2" htmlFor="new-password">New Password</Label>
                    <Input
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Label className="mb-2" htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            </div>

            <Button className="mt-4" onClick={handleSubmit}>{loading ? "Updating..." : "Update"}</Button>
        </>
    );
}
