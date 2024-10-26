import useAuth from "@/hooks/use-auth";
import { ROLES } from "@/lib/roles";
import { ChevronDownIcon, KeyIcon, LogOut, Store, User } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AdminSidebarMobile } from "./admin-sidebar";
import { Link } from "react-router-dom";

export default function AdminTopBar() {
    const { auth, logoutFn } = useAuth();

    return (
        <div className="flex justify-between items-center border-b p-4 h-16">
            <div className="flex items-center gap-2">
                <AdminSidebarMobile />
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{auth?.role === ROLES.SUPER_ADMIN ? "Super Admin Panel" : "Admin Panel"} </h1>
            </div>
            <div className="flex items-center gap-2">
                <p>{auth?.user_name || <Link to={`/store/${auth?.store_slug}`}>{auth?.store_name}</Link>}</p>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                        <Button size="sm" className="rounded-full w-8 h-8"><User /></Button>
                        <ChevronDownIcon className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-4">
                        {auth?.role === ROLES.ADMIN && (
                            <>
                                <DropdownMenuLabel>{auth?.store_id}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link to={`/store/${auth?.store_slug}`} className="flex gap-1 items-center cursor-pointer">
                                        <Store className="w-4 h-4" /> Visit Store
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link to={"/admin/change-password"} className="flex gap-1 items-center cursor-pointer">
                                        <KeyIcon className="w-4 h-4" /> Password Change
                                    </Link>
                                </DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuItem>
                            <div className="flex gap-1 items-center cursor-pointer" onClick={logoutFn}>
                                <LogOut className="w-4 h-4" /> Logout
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

