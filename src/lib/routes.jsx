import AdminDashboard from "@/pages/admin/admin-dashboard";
import CreateUpdateStore from "@/pages/super-admin/create-update-store";
import SuperAdminDashboard from "@/pages/super-admin/super-admin-dashboard";
import SuperAdminLogin from "@/pages/super-admin/super-admin-login";
import SuperAdminStoreList from "@/pages/super-admin/super-admin-stores";
import { ROLES } from "./roles";
import AdminCategory from "@/pages/admin/admin-category";

export const protectedRoutes = [
    // SUPER ADMIN ROUTES
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
    },

    // ADMIN Routes
    {
        _id: "A1",
        element: <AdminDashboard />,
        link: "/admin",
        assignedRoles: [ROLES.ADMIN]
    },
    {
        _id: "A2",
        element: <AdminCategory />,
        link: "/admin/category",
        assignedRoles: [ROLES.ADMIN]
    }
]