import AdminProductDetailsShow from "@/components/admin/show-product-details";
import NotFound from "@/components/not-found";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { showAlert } from "@/lib/catch-async-api";
import { currencyIcon } from "@/lib/constants";
import { getAllProductCategoryFn } from "@/services/admin/category-service";
import { deleteProductFn, getAllProductAdminFn, productActiveStatusFn } from "@/services/admin/product-service";
import ShimmerTableBody from "@/shimmer/table-shimmer";
import { Edit, EyeIcon, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react"; // Import useState to manage state
import { Link } from "react-router-dom";
import { buttonVariants } from "../../components/ui/button";
import Title from "../../components/ui/title";

export default function AdminProductList() {
    const [displayProductDetails, setDisplayProductDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("all");
    const [categories, setCategories] = useState([]);

    const getProducts = useCallback(() => {
        getAllProductAdminFn({ search, categoryId: categoryId === "all" ? "" : categoryId })
            .then((response) => {
                setProducts(response.data);

            })
            .finally(() => setLoading(false));
    }, [search, categoryId])

    const handleActiveStatus = (product_id) => {
        productActiveStatusFn({ product_id })
            .then((data) => {
                showAlert(data);
                getProducts();
            })
    }

    const handleDelete = (product_id) => {
        deleteProductFn({ product_id })
            .then((data) => {
                showAlert(data);
                getProducts();
            })
    }

    useEffect(() => {
        const timer = setTimeout(getProducts, 500);

        return () => clearTimeout(timer);
    }, [getProducts]);

    useEffect(() => {
        getAllProductCategoryFn()
            .then(data => setCategories(data?.data));
    }, [])

    return (
        <>
            <Title title={"Products"} />
            <div className="flex gap-4 items-center justify-between my-4">
                <div className="flex gap-4 items-center w-[600px]">
                    <Input
                        type="text"
                        placeholder="Search by store ID, customer name, or phone"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 border rounded w-full lg:w-[400px] my-4"
                    />
                    <Select
                        defaultValue={categoryId}
                        onValueChange={(value) => setCategoryId(value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"all"}>All</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.ctg_id} value={cat.ctg_id}>
                                    {cat.ctg_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Link to={"/admin/products/add"} className={buttonVariants()}>Add</Link>
            </div>

            <div className="overflow-x-auto w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell className="text-sm text-center font-bold">Title</TableCell>
                            <TableCell className="text-sm text-center font-bold">Category Name</TableCell>
                            <TableCell className="text-sm text-center font-bold">Price ({currencyIcon})</TableCell>
                            <TableCell className="text-sm text-center font-bold">Image</TableCell>
                            <TableCell className="text-sm text-center font-bold">Variant 1</TableCell>
                            <TableCell className="text-sm text-center font-bold">Variant 2</TableCell>
                            <TableCell className="text-sm text-center font-bold">Variant 3</TableCell>
                            <TableCell className="text-sm text-center font-bold">Created Date</TableCell>
                            <TableCell className="text-sm text-center font-bold">Active</TableCell>
                            <TableCell className="text-sm text-center font-bold">View</TableCell>
                            <TableCell className="text-sm text-center font-bold">Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    {loading && <ShimmerTableBody coloumn={11} row={10} />}
                    <TableBody>
                        {!loading && products.length === 0 && (<TableRow>
                            <TableCell className="min-h-[500px]" colSpan={11}>
                                <NotFound className="mx-auto" />
                            </TableCell>
                        </TableRow>
                        )}
                        {!loading && products.length > 0 && (
                            products.map((product) => (
                                <TableRow key={product?.product_id}>
                                    <TableCell className="text-sm text-center">{product?.title}</TableCell>
                                    <TableCell className="text-sm text-center">{product?.ctg_name}</TableCell>
                                    <TableCell className="text-sm text-center">{currencyIcon}{product?.variants?.[0]?.price}</TableCell>
                                    <TableCell className="text-sm text-center">
                                        <img src={product?.images?.[0]?.url} alt={product?.title} className="w-10 mx-auto" />
                                    </TableCell>
                                    <TableCell className="text-sm text-center">
                                        {product?.variants?.[0]?.variant_title} <br />
                                        <span className="text-xs">{currencyIcon}{product?.variants?.[0]?.price} / {product?.variants?.[0]?.stock}</span>
                                    </TableCell>
                                    <TableCell className="text-sm text-center">
                                        {
                                            product?.variants?.[1]
                                                ? <>
                                                    {product?.variants?.[1]?.variant_title} <br />
                                                    <span className="text-xs">
                                                        {currencyIcon}{product?.variants?.[1]?.price} / {product?.variants?.[1]?.stock}
                                                    </span>
                                                </>
                                                : "--"
                                        }
                                    </TableCell>
                                    <TableCell className="text-sm text-center">
                                        {
                                            product?.variants?.[2]
                                                ? <>
                                                    {product?.variants?.[2]?.variant_title} <br />
                                                    <span className="text-xs">
                                                        {currencyIcon}{product?.variants?.[2]?.price} / {product?.variants?.[2]?.stock}
                                                    </span>
                                                </>
                                                : "--"
                                        }
                                    </TableCell>
                                    <TableCell className="text-sm text-center">{new Date(product?.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-sm text-center">
                                        <Switch
                                            checked={!!product?.is_active}
                                            onCheckedChange={() => handleActiveStatus(product?.product_id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-sm text-center">
                                        <EyeIcon className="mx-auto cursor-pointer" onClick={() => setDisplayProductDetails(product)} />
                                    </TableCell>
                                    <TableCell className="text-sm text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link to={`/admin/products/update/${product?.product_id}`} className="text-blue-600">
                                                <Edit />
                                            </Link>
                                            <Trash className="text-red-600 cursor-pointer" onClick={() => handleDelete(product?.product_id)} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <AdminProductDetailsShow item={displayProductDetails} setDisplayProductDetails={setDisplayProductDetails} />
            </div>
        </>
    );
}
