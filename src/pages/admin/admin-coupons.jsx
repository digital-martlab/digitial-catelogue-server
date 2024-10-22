import AddUpdateCoupons from "@/components/admin/add-update-coupons";
import { Button } from "@/components/ui/button";
import Title from "@/components/ui/title";
import { showAlert } from "@/lib/catch-async-api";
import { deleteCouponFn, getAllCouponFn } from "@/services/admin/coupon-service";
import { useCallback, useEffect, useState } from "react";

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [toggle, setToggle] = useState(null);

    const getAllCoupon = useCallback(() => {
        getAllCouponFn()
            .then(({ data }) => setCoupons(data));
    }, []);

    useEffect(() => {
        getAllCoupon();
    }, [getAllCoupon]);

    const handleEdit = (coupon) => {
        setToggle({
            action: "edit",
            coupon,
        });
    };

    const handleDelete = (cpn_id) => {
        deleteCouponFn({ cpn_id }).then((data) => {
            showAlert(data);
            getAllCoupon();
        });
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <Title title={"Coupons"} />
                <Button onClick={() => setToggle({ action: "add" })}>Add</Button>
            </div>

            <AddUpdateCoupons toggle={toggle} setToggle={setToggle} getAllCoupon={getAllCoupon} />

            {/* Displaying Categories in Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {coupons.map((coupon) => (
                    <div
                        key={coupons.cpn_id}
                        className="border rounded-lg p-4 shadow-md flex justify-between items-center"
                    >
                        <div>
                            <h3 className="text-lg font-semibold">{coupon.cpn_name}</h3>
                            <p>{coupon.cpn_discount}%</p>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => handleEdit(coupon)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleDelete(coupon.cpn_id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
