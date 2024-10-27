import AddUpdateProductCategory from "@/components/admin/add-update-product-category";
import NotFound from "@/components/not-found";
import { Button } from "@/components/ui/button";
import Title from "@/components/ui/title";
import { showAlert } from "@/lib/catch-async-api";
import { deleteProductCategoryFn, getAllProductCategoryFn } from "@/services/admin/category-service";
import CategoryCouponShimmer from "@/shimmer/coupon-category-shimmer";
import { useCallback, useEffect, useState } from "react";

export default function AdminCategory() {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [toggle, setToggle] = useState(null);

    const getAllCategory = useCallback(() => {
        getAllProductCategoryFn({})
            .then(({ data }) => {
                setCategories(data)
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        getAllCategory();
    }, [getAllCategory]);

    const handleEdit = (category) => {
        setToggle({
            action: "edit",
            category: category,
        });
    };

    const handleDelete = (ctg_id) => {
        deleteProductCategoryFn({ ctg_id }).then((data) => {
            showAlert(data);
            getAllCategory();
        });
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <Title title={"Product Category"} />
                <Button onClick={() => setToggle({ action: "add" })}>Add</Button>
            </div>

            <AddUpdateProductCategory toggle={toggle} setToggle={setToggle} getAllCategory={getAllCategory} />

            {loading && <CategoryCouponShimmer />}
            {categories.length === 0 && !loading && <NotFound className={"md:w-1/2 lg:w-1/3 mx-auto mt-0"} />}
            {!loading && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((category) => (
                    <div
                        key={category.ctg_id}
                        className="border rounded-lg p-4 shadow-md flex justify-between items-center bg-card"
                    >
                        <div>
                            <h3 className="text-lg font-semibold">{category.ctg_name}</h3>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => handleEdit(category)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleDelete(category.ctg_id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>}
        </>
    );
}
