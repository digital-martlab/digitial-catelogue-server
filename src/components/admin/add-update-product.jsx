import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useSelectImages from "@/hooks/use-select-image";
import { showAlert } from "@/lib/catch-async-api";
import { getAllProductCategoryFn } from "@/services/admin/category-service";
import { createProductAdminFn } from "@/services/admin/product-service";
import { Camera, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Title from "../ui/title";

export default function AddUpdateProduct() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { selectedImages, setSelectDialogOpen, handelDeleteSingleSelectedImages, handleDeleteAllSelectedImages } = useSelectImages();
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [variants, setVariants] = useState([{ variantId: 1, variantTitle: "", price: "", stock: "" }]);

    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        const updatedVariants = [...variants];
        updatedVariants[index][name] = value;
        setVariants(updatedVariants);
    };

    const handleAddVariant = () => {
        if (variants.length < 3) {
            setVariants([...variants, { variantId: variants.length + 1, variantTitle: "", price: "", stock: "" }]);
        } else {
            showAlert({ message: "You can create at most 4 variants." });
        }
    };

    const handleDeleteVariant = (variantId) => {
        setVariants((prev) => prev.filter((variant) => variant.variantId !== variantId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if any required field is empty
        if (!categoryId || !title.trim() || !description.trim() || variants.some(v => !v.variantTitle || !v.price || !v.stock) || !selectedImages[0]) {
            showAlert({ message: "Please fill out all fields, including at least one image, title, description, and variant details." }, true);
            return;
        }

        const data = {
            title,
            selectedImages,
            categoryId: parseInt(categoryId, 10),
            description,
            variants
        }

        setLoading(true);
        createProductAdminFn(data).then((data) => {
            showAlert(data)
            navigate("/admin/products");
            handleDeleteAllSelectedImages();
        }).finally(() => setLoading(false))
    };

    useEffect(() => {
        getAllProductCategoryFn().then(({ data }) => setCategories(data));
    }, []);

    return (
        <>
            <Title title="Add Product" className="text-center mb-6" />
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 shadow-md rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-3">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter product title"
                                className="border rounded-md p-2"
                            />
                        </div>

                        <div className="flex flex-col space-y-3">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                id="category"
                                value={categoryId}
                                onValueChange={(value) => setCategoryId(value.toString())}
                                className="border rounded-md"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.length === 0 ? (
                                        <SelectItem disabled>No categories available</SelectItem>
                                    ) : (
                                        categories.map((cat) => (
                                            <SelectItem key={cat.ctg_id} value={cat.ctg_id.toString()}>
                                                {cat.ctg_name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter product description"
                                rows="4"
                                className="border rounded-md p-2"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="grid grid-cols-2 gap-4">
                            {selectedImages.map((img, index) => (
                                <div
                                    key={index}
                                    className="w-full h-24 overflow-hidden rounded-md border relative flex justify-center items-center group"
                                >
                                    <img
                                        src={img.url}
                                        width={400}
                                        height={400}
                                        alt={`Preview ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <label
                                            className="cursor-pointer h-8 w-8 bg-primary rounded-full flex items-center justify-center"
                                            onClick={() => setSelectDialogOpen(6)}
                                        >
                                            <Camera className="w-4 text-black h-4" />
                                        </label>
                                        <label
                                            className="cursor-pointer h-8 w-8 bg-red-500 rounded-full flex items-center justify-center"
                                            onClick={() => handelDeleteSingleSelectedImages(img)}
                                        >
                                            <Trash2Icon className="w-4 h-4" />
                                        </label>
                                    </div>
                                </div>
                            ))}
                            {selectedImages.length <= 3 && (
                                <div className="w-full h-24 border rounded-md flex justify-center items-center cursor-pointer">
                                    <label
                                        className="cursor-pointer"
                                        onClick={() => setSelectDialogOpen(3)}
                                    >
                                        <Camera className="w-12 h-12 text-secondary" />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-end my-4">
                    <Button type="button" size="sm" onClick={handleAddVariant}>
                        Add Another Variant
                    </Button>
                </div>
                <fieldset className="border rounded-lg p-4 my-4">
                    <legend className="font-semibold">Variants</legend>
                    {variants.map((variant, index) => (
                        <div key={variant.variantId} className="mb-4 border p-4 rounded-lg">
                            <Label htmlFor={`variantTitle_${variant.variantId}`}>Variant Title</Label>
                            <Input
                                id={`variantTitle_${variant.variantId}`}
                                name="variantTitle"
                                type="text"
                                value={variant.variantTitle}
                                onChange={(e) => handleVariantChange(index, e)}
                                placeholder="Enter variant title"
                                className="my-2 border rounded-md p-2"
                            />
                            <Label htmlFor={`price_${variant.variantId}`}>Price</Label>
                            <Input
                                id={`price_${variant.variantId}`}
                                name="price"
                                type="number"
                                value={variant.price}
                                onChange={(e) => handleVariantChange(index, e)}
                                placeholder="Enter variant price"
                                className="my-2 border rounded-md p-2"
                            />
                            <Label htmlFor={`stock_${variant.variantId}`}>Stock</Label>
                            <Input
                                id={`stock_${variant.variantId}`}
                                name="stock"
                                type="number"
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(index, e)}
                                placeholder="Enter variant stock"
                                className="my-2 border rounded-md p-2"
                            />
                            {variants.length > 1 && (
                                <Button
                                    variant="destructive"
                                    className="mt-2"
                                    size="sm"
                                    onClick={() => handleDeleteVariant(variant.variantId)}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    ))}
                </fieldset>

                <Button type="submit" className="w-full mt-4 bg-primary hover:bg-primary-dark">
                    {loading ? "Saving..." : "Add"} Product
                </Button>
            </form>
        </>
    );
}
