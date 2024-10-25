import Title from "@/components/ui/title";
import { getDashboardFn } from "@/services/admin/dashboard";
import ShimmerAdminDashboard from "@/shimmer/admin/dashboard-shimmer-admin";
import { ChartBarStacked, ShoppingBasket, TagIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        total_categories: 0,
        total_active_products: 0,
        total_products: 0,
        total_coupons: 0,
    });

    useEffect(() => {
        getDashboardFn()
            .then(({ data }) => {
                setDashboardData(data);
                setLoading(false);
            });
    }, []);

    console.log(dashboardData);

    return (
        <>
            <Title title={"Dashboard"} />
            {loading && <ShimmerAdminDashboard />}
            {!loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                {/* Total Categories */}
                <Link to="/admin/category">
                    <div className="p-4 flex flex-col items-center justify-center border rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-2xl mb-2">
                            <ChartBarStacked />
                        </div>
                        <h3 className="text-lg font-semibold">Total Categories</h3>
                        <p className="text-xl font-bold">{dashboardData?.total_categories}</p>
                    </div>
                </Link>

                {/* Total Products */}
                <Link to="/admin/products">
                    <div className="p-4 flex flex-col items-center justify-center border rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-2xl mb-2">
                            <ShoppingBasket />
                        </div>
                        <h3 className="text-lg font-semibold">Total Active Products</h3>
                        <p className="text-xl font-bold">{dashboardData?.total_active_products}</p>
                    </div>
                </Link>

                {/* Total Products */}
                <Link to="/admin/products">
                    <div className="p-4 flex flex-col items-center justify-center border rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-2xl mb-2">
                            <ShoppingBasket />
                        </div>
                        <h3 className="text-lg font-semibold">Total Products</h3>
                        <p className="text-xl font-bold">{dashboardData?.total_products}</p>
                    </div>
                </Link>

                {/* Total Coupons */}
                <Link to="/spanel/coupons">
                    <div className="p-4 flex flex-col items-center justify-center border rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-2xl mb-2">
                            <TagIcon />
                        </div>
                        <h3 className="text-lg font-semibold">Total Coupons</h3>
                        <p className="text-xl font-bold">{dashboardData?.total_coupons}</p>
                    </div>
                </Link>
            </div>}
        </>
    );
}
