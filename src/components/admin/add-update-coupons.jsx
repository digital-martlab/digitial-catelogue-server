import { showAlert } from "@/lib/catch-async-api";
import { createCouponFn, updateCouponFn } from "@/services/admin/coupon-service";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function AddUpdateCoupons({ toggle, setToggle, getAllCoupon }) {
    const [loading, setLoading] = useState(false);
    const [couponName, setCouponName] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);


    const handleOnChange = () => {
        setCouponName("");
        setToggle(null);
        setCouponDiscount(0);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!couponName || !couponDiscount) return showAlert({ message: "all fields are required." })

        setLoading(true)
        if (toggle?.action === "add") {
            createCouponFn({ cpn_name: couponName, cpn_discount: couponDiscount })
                .then((data) => {
                    showAlert(data);
                    handleOnChange();
                    getAllCoupon();
                })
                .finally(() => setLoading(false));
        } else {
            updateCouponFn({ cpn_name: couponName, cpn_discount: couponDiscount, cpn_id: toggle?.coupon?.cpn_id })
                .then((data) => {
                    showAlert(data);
                    handleOnChange();
                    getAllCoupon();
                })
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        console.log(toggle);
        if (toggle?.action === "edit" && toggle?.coupon) {
            setCouponName(toggle?.coupon?.cpn_name)
            setCouponDiscount(toggle?.coupon?.cpn_discount)
        }
    }, [toggle])

    return (
        <Dialog open={!!toggle} onOpenChange={handleOnChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold">{toggle?.action === "add" ? "Add" : "Update"} Coupon</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="category"
                            placeholder="name"
                            value={couponName}
                            onChange={(e) => setCouponName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="discount">Discount</Label>
                        <Input
                            type="number"
                            id="discount"
                            placeholder="Discount"
                            value={couponDiscount}
                            onChange={(e) => setCouponDiscount(e.target.value)}
                        />
                    </div>
                    <Button size="sm" type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
