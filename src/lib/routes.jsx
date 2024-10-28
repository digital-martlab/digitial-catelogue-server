import AdminDashboard from "@/pages/admin/admin-dashboard";
import CreateUpdateStore from "@/pages/super-admin/create-update-store";
import SuperAdminDashboard from "@/pages/super-admin/super-admin-dashboard";
import SuperAdminLogin from "@/pages/super-admin/super-admin-login";
import SuperAdminStoreList from "@/pages/super-admin/super-admin-stores";
import { ROLES } from "./roles";
import AdminCategory from "@/pages/admin/admin-category";
import AdminCoupons from "@/pages/admin/admin-coupons";
import AdminPasswordChange from "@/components/admin/change-password-admin";
import AdminProductList from "@/pages/admin/product-list-admin";
import AddUpdateProduct from "@/components/admin/add-update-product";
import AdminThemeCustomizer from "@/pages/admin/admin-theme-customizer";

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
    },
    {
        _id: "A3",
        element: <AdminCoupons />,
        link: "/admin/coupons",
        assignedRoles: [ROLES.ADMIN]
    },
    {
        _id: "A4",
        element: <AdminPasswordChange />,
        link: "/admin/change-password",
        assignedRoles: [ROLES.ADMIN],
    },
    {
        _id: "A5",
        element: <AdminProductList />,
        link: "/admin/products",
        assignedRoles: [ROLES.ADMIN],
    },
    {
        _id: "A6",
        element: <AddUpdateProduct />,
        link: "/admin/products/:status",
        assignedRoles: [ROLES.ADMIN],
    },
    {
        _id: "A7",
        element: <AddUpdateProduct />,
        link: "/admin/products/:status/:product_id",
        assignedRoles: [ROLES.ADMIN],
    },
    {
        _id: "A8",
        element: <AdminThemeCustomizer />,
        link: "/admin/themes",
        assignedRoles: [ROLES.ADMIN]
    }
]