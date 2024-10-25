import NotFound from "@/components/not-found";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { showAlert } from "@/lib/catch-async-api";
import { getAllProductCategoryFn } from "@/services/admin/category-service";
import { deleteProductFn, getAllProductAdminFn, productActiveStatusFn } from "@/services/admin/product-service";
import ShimmerTableBody from "@/shimmer/table-shimmer";
import { useCallback, useEffect, useState } from "react"; // Import useState to manage state
import { Link } from "react-router-dom";
import { buttonVariants } from "../../components/ui/button";
import Title from "../../components/ui/title";

export default function AdminProductList() {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
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
        getProducts();
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
                            <TableCell className="text-sm text-center font-bold">Product ID</TableCell>
                            <TableCell className="text-sm text-center font-bold">Title</TableCell>
                            <TableCell className="text-sm text-center font-bold">Description</TableCell>
                            <TableCell className="text-sm text-center font-bold">Category Name</TableCell>
                            <TableCell className="text-sm text-center font-bold">Created Date</TableCell>
                            <TableCell className="text-sm text-center font-bold">Updated Date</TableCell>
                            <TableCell className="text-sm text-center font-bold">Active</TableCell>
                            <TableCell className="text-sm text-center font-bold">Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    {loading && <ShimmerTableBody coloumn={8} row={10} />}
                    <TableBody>
                        {!loading && products.length === 0 && (<TableRow>
                            <TableCell className="min-h-[500px]" colSpan={8}>
                                <NotFound className="mx-auto" />
                            </TableCell>
                        </TableRow>
                        )}
                        {!loading && products.length > 0 && (
                            products.map((product) => (
                                <TableRow key={product?.product_id}>
                                    <TableCell className="text-sm text-center">{product?.product_id}</TableCell>
                                    <TableCell className="text-sm text-center">{product?.title}</TableCell>
                                    <TableCell className="text-sm text-center">{product?.description}</TableCell>
                                    <TableCell className="text-sm text-center">{product?.ctg_name}</TableCell>
                                    <TableCell className="text-sm text-center">{new Date(product?.created_at).toLocaleString()}</TableCell>
                                    <TableCell className="text-sm text-center">{new Date(product?.updated_at).toLocaleString()}</TableCell>
                                    <TableCell className="text-sm text-center">
                                        <Switch
                                            checked={!!product?.is_active}
                                            onCheckedChange={() => handleActiveStatus(product?.product_id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-sm text-center flex gap-2 justify-center">
                                        <Link to={`/admin/products/edit/${product?.product_id}`} className="text-blue-600">Edit</Link>
                                        <p className="text-red-600 cursor-pointer" onClick={() => handleDelete(product?.product_id)}>Delete</p>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
