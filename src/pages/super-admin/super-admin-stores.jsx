import NotFound from "@/components/not-found";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from "@/components/ui/table";
import Title from "@/components/ui/title";
import { showAlert } from "@/lib/catch-async-api";
import { deletSingleStoreFn, getAllStoresFn, updateStoreStatusFn } from "@/services/super-admin/store-service";
import ShimmerTableBody from "@/shimmer/table-shimmer";
import { Eye } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SuperAdminStoreList() {
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState("");
    const [stores, setStores] = useState([]);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const getData = useCallback(() => {
        getAllStoresFn({ search, page: currentPage }).then((data) => {
            const { currentPage, totalPages, totalRecords, stores } = data.data;
            setCurrentPage(currentPage);
            setTotalPages(totalPages);
            setTotalRecords(totalRecords);
            setStores(stores);
            setLoading(false);
        });
    }, [currentPage, search]);

    const updateStatus = (store_id) => {
        updateStoreStatusFn(store_id).then(() => {
            getData();
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => getData(), [500]);
        return () => clearTimeout(timer);
    }, [getData, search]);

    const handleDeleteStore = (store) => {
        setIsDeleting(true)
        deletSingleStoreFn({ store_id: store?.acc_id })
            .then((data) => {
                showAlert(data);
                setDeleteDialogOpen(null);
                getData();
            })
            .finally(() => setIsDeleting(false));
    }

    return (
        <div>
            <Title title={"Stores"} />
            <div className="flex gap-4 items-center my-4">
                <Input
                    type="text"
                    placeholder="Search by store ID, customer name, or phone"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border rounded w-full lg:w-[400px] my-4"
                />
                <Link to="/super-admin/stores/add" className={buttonVariants({
                    size: "sm"
                })}>
                    Create Store
                </Link>
            </div>
            <div className="overflow-x-auto w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell className="text-sm text-center font-bold">Store ID</TableCell>
                            <TableCell className="text-sm text-center font-bold">Store Name</TableCell>
                            <TableCell className="text-sm text-center font-bold">Customer Name</TableCell>
                            <TableCell className="text-sm text-center font-bold">Email</TableCell>
                            <TableCell className="text-sm text-center font-bold">Phone</TableCell>
                            <TableCell className="text-sm text-center font-bold">Logo</TableCell>
                            <TableCell className="text-sm text-center font-bold">Created Date</TableCell>
                            <TableCell className="text-sm text-center font-bold">Updated Date</TableCell>
                            <TableCell className="text-sm text-center font-bold">Expire Date</TableCell>
                            <TableCell className="text-sm text-center font-bold">Active</TableCell>
                            <TableCell className="text-sm text-center font-bold">Visit Store</TableCell>
                            <TableCell className="text-sm text-center font-bold">Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    {loading && <ShimmerTableBody row={10} coloumn={12} />}
                    {!loading &&
                        <TableBody>
                            {!loading && stores.length === 0 && (<TableRow>
                                <TableCell className="min-h-[500px]" colSpan={12}>
                                    <NotFound className="mx-auto" />
                                </TableCell>
                            </TableRow>
                            )}
                            {stores?.map(store => (
                                <TableRow key={store.store_id}>
                                    <TableCell>
                                        <p className="mx-auto text-center ">
                                            {store.store_id}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-sm text-center">{store.store_name}</TableCell>
                                    <TableCell className="text-sm text-center">{store.name}</TableCell>
                                    <TableCell className="text-sm text-center">{store.email}</TableCell>
                                    <TableCell className="text-sm text-center">{store.number}</TableCell>
                                    <TableCell className="text-sm text-center">
                                        <img src={store.logo} alt="logo" className="w-10 h-10 rounded-full mx-auto object-contain" />
                                    </TableCell>
                                    <TableCell className="text-sm text-center">{new Date(store.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-sm text-center">{new Date(store.updated_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-sm text-center">{new Date(store.plan_expires_in).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-sm text-center">
                                        {/* {store.is_active ? 'Active' : 'Inactive'} */}
                                        <Switch
                                            checked={!!store.is_active}
                                            onCheckedChange={() => updateStatus(store.store_id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-sm text-center"><Link to={`/store/${store.store_slug}`} target="_blank"><Eye className="mx-auto" /></Link></TableCell>
                                    <TableCell className="text-sm text-center">
                                        <Link to={`/super-admin/stores/update/${store?.store_id}`} className="text-blue-500">Edit</Link>
                                        <p className="text-red-500 cursor-pointer" onClick={() => setDeleteDialogOpen(store)}>Delete</p>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    }
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={12}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        className={`cursor-pointer ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        onClick={() =>
                                                            currentPage > 1 && setCurrentPage(currentPage - 1)
                                                        }
                                                    />
                                                </PaginationItem>
                                                {Array.from({ length: totalPages }, (_, index) => (
                                                    <PaginationItem key={index}>
                                                        <PaginationLink
                                                            className={`cursor-pointer ${currentPage === index + 1 ? "font-bold" : ""}`}
                                                            onClick={() => setCurrentPage(index + 1)}
                                                        >
                                                            {index + 1}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                                <PaginationItem>
                                                    <PaginationNext
                                                        className={`cursor-pointer ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                                                        onClick={() =>
                                                            currentPage < totalPages &&
                                                            setCurrentPage(currentPage + 1)
                                                        }
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                    <p className="text-right">
                                        {stores.length} of {totalRecords} Stores
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
            <Dialog
                open={!!isDeleteDialogOpen}
                onOpenChange={() => setDeleteDialogOpen(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are You Sure?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete this store? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end">
                        <Button
                            variant={"outline"}
                            onClick={() => setDeleteDialogOpen(null)}
                            className="mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={"destructive"}
                            onClick={() => handleDeleteStore(isDeleteDialogOpen)}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
