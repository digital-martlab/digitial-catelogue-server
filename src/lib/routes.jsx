import SuperAdminLogin from "@/pages/super-admin/super-admin-login";
import { ROLES } from "./roles";
import SuperAdminDashboard from "@/pages/super-admin/super-admin-dashboard";
import SuperAdminStoreList from "@/pages/super-admin/super-admin-stores";

export const protectedRoutes = [
    {
        _id: 1,
        element: <SuperAdminLogin />,
        link: "/super-admin/login",
        assignedRoles: [ROLES.SUPER_ADMIN]
    },
    {
        _id: 2,
        element: <SuperAdminDashboard />,
        link: "/super-admin/",
        assignedRoles: [ROLES.SUPER_ADMIN]
    },
    {
        _id: 3,
        element: <SuperAdminStoreList />,
        link: "/super-admin/stores",
        assignedRoles: [ROLES.SUPER_ADMIN]
    }
]