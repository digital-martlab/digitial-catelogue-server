import { ChartBarStacked, LayoutDashboard, ShoppingBag, StoreIcon, TagIcon } from "lucide-react";

export const SuperAdminSidbarList = [
    {
        _id: 1,
        title: "Dashboard",
        icon: LayoutDashboard,
        link: "/super-admin"
    },
    {
        _id: 2,
        title: "Stores",
        icon: StoreIcon,
        link: "/super-admin/stores"
    },
    // {
    //     _id: 3,
    //     title: "Themes",
    //     icon: LayoutGridIcon,
    //     link: "/super-admin/themes"
    // }
]

export const AdminSidbarList = [
    {
        _id: 1,
        title: "Dashboard",
        icon: LayoutDashboard,
        link: "/admin"
    },
    {
        _id: 2,
        title: "Category",
        icon: ChartBarStacked,
        link: "/admin/category"
    },
    {
        _id: 3,
        title: "Products",
        icon: ShoppingBag,
        link: "/admin/products"
    },
    {
        _id: 4,
        title: "Coupons",
        icon: TagIcon,
        link: "/admin/coupons"
    }
]