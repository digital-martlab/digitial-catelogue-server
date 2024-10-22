import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createProductCategoryFn, updateProductCategoryFn } from "@/services/admin/category-service";
import { showAlert } from "@/lib/catch-async-api";

export default function AddUpdateProductCategory({ toggle, setToggle, getAllCategory }) {
    const [loading, setLoading] = useState(false);
    const [categoryName, setCategoryName] = useState("");


    const handleOnChange = () => {
        setCategoryName("");
        setToggle(null);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!categoryName) return showAlert({ message: "category name is required." })

        setLoading(true)
        if (toggle?.action === "add") {
            createProductCategoryFn({ category_name: categoryName })
                .then((data) => {
                    showAlert(data);
                    handleOnChange();
                })
                .finally(() => setLoading(false));
        } else {
            updateProductCategoryFn({ category_name: categoryName, ctg_id: toggle?.category?.ctg_id })
                .then((data) => {
                    showAlert(data);
                    handleOnChange();
                    getAllCategory();
                })
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        if (toggle?.action === "edit" && toggle?.category)
            setCategoryName(toggle?.category?.ctg_name)
    }, [toggle])

    return (
        <Dialog open={!!toggle} onOpenChange={handleOnChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold">{toggle?.action === "add" ? "Add" : "Update"} Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Name</Label>
                        <Input
                            id="category"
                            placeholder="Category Name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    </div>
                    <Button size="sm" type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
