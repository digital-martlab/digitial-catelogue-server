import AdminSidebar from "@/components/admin-layout/admin-sidebar";
import AdminTopBar from "@/components/admin-layout/admin-topbar";
import { useWindowWidth } from "@react-hook/window-size";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    const onlyWidth = useWindowWidth();

    return (
        <section className="grid grid-cols-1 lg:grid-cols-[200px_1fr] h-screen">
            {onlyWidth >= 1024 && <AdminSidebar />}
            <section>
                <AdminTopBar />
                <div className="p-4" >
                    <Outlet />
                </div>
            </section>
        </section>
    )
}