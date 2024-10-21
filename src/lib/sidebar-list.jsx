import { LayoutDashboard, LayoutGridIcon, StoreIcon } from "lucide-react";

export const AdminSidbarList = [
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
    {
        _id: 3,
        title: "Themes",
        icon: LayoutGridIcon,
        link: "/super-admin/themes"
    }
]