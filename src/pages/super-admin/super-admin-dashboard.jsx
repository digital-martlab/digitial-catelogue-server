import Title from "@/components/ui/title";
import { getSuperAdminDashboardFn } from "@/services/super-admin/dashboard-service";
import ShimmerAdminDashboard from "@/shimmer/admin/dashboard-shimmer-admin";
import { Contact2, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SuperAdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDasboardData] = useState({
        total_stores: 0,
        total_contacts: 1
    })

    useEffect(() => {
        getSuperAdminDashboardFn()
            .then(data => setDasboardData(data?.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Title title={"Dashboard"} />
            {loading && <ShimmerAdminDashboard />}
            {!loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                {/* Total Categories */}
                <Link to="/super-admin/stores">
                    <div className="p-4 flex flex-col items-center bg-card justify-center border rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-2xl mb-2">
                            <Store />
                        </div>
                        <h3 className="text-center text-lg font-semibold">Total Categories</h3>
                        <p className="text-xl font-bold">{dashboardData?.total_stores}</p>
                    </div>
                </Link>

                {/* Total Products */}
                <Link to="/super-admin/contacts">
                    <div className="p-4 flex flex-col items-center bg-card justify-center border rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <div className="text-2xl mb-2">
                            <Contact2 />
                        </div>
                        <h3 className="text-center text-lg font-semibold">Total Active Products</h3>
                        <p className="text-xl font-bold">{dashboardData?.total_contacts}</p>
                    </div>
                </Link>
            </div>}
        </>
    )
} 