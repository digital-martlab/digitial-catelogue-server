import CreateUpdateStore from "@/pages/super-admin/create-update-store";
import SuperAdminDashboard from "@/pages/super-admin/super-admin-dashboard";
import SuperAdminLogin from "@/pages/super-admin/super-admin-login";
import SuperAdminStoreList from "@/pages/super-admin/super-admin-stores";
import { ROLES } from "./roles";

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
    },
    {
        _id: 4,
        element: <CreateUpdateStore />,
        link: "/super-admin/stores/:status",
        assignedRoles: [ROLES.SUPER_ADMIN]
    },
    {
        _id: 5,
        element: <CreateUpdateStore />,
        link: "/super-admin/stores/:status/:store_id",
        assignedRoles: [ROLES.SUPER_ADMIN]
    }
]