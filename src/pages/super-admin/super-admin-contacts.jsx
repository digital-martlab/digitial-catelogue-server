import LoadingSpinner from "@/components/loading-spinner";
import NotFound from "@/components/not-found";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import Title from "@/components/ui/title";
import { showAlert } from "@/lib/catch-async-api";
import { deleteContactFn, getAllContactsFn } from "@/services/contact-service";
import ShimmerTableBody from "@/shimmer/table-shimmer";
import { Eye, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function SuperAdminContactsList() {
    const [search, setSearch] = useState("");
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);

    const fetchContacts = () => {
        setLoading(true);
        getAllContactsFn({ search })
            .then((data) => setContacts(data?.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const timer = setTimeout(fetchContacts, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = (contactId) => {
        deleteContactFn({ id: contactId })
            .then((response) => {
                showAlert(response.message);
                fetchContacts();
            })
            .catch((error) => showAlert(error.message));
    };

    const handleViewDetails = (contact) => {
        setSelectedContact(contact);
    };

    const closeModal = () => setSelectedContact(null);

    return (
        <>
            <Title title="Contact Us" />
            <Input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 border rounded w-full md:w-[400px] my-4"
            />

            <div className="overflow-x-auto w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell className="text-sm text-center font-bold">Name</TableCell>
                            <TableCell className="text-sm text-center font-bold">Email</TableCell>
                            <TableCell className="text-sm text-center font-bold">Phone</TableCell>
                            <TableCell className="text-sm text-center font-bold">Date</TableCell>
                            <TableCell className="text-sm text-center font-bold">Actions</TableCell>
                        </TableRow>
                    </TableHeader>
                    {loading && <ShimmerTableBody coloumn={5} row={5} />}
                    <TableBody>
                        {!loading && contacts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    <NotFound className="mx-auto" />
                                </TableCell>
                            </TableRow>
                        )}
                        {contacts.map((contact) => (
                            <TableRow key={contact.id}>
                                <TableCell className="text-sm text-center">{contact.name}</TableCell>
                                <TableCell className="text-sm text-center">{contact.email}</TableCell>
                                <TableCell className="text-sm text-center">{contact.phone}</TableCell>
                                <TableCell className="text-sm text-center">
                                    {new Date(contact.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-sm text-center flex justify-center space-x-2">
                                    <Eye
                                        className="text-primary cursor-pointer"
                                        onClick={() => handleViewDetails(contact)}
                                    />
                                    <Trash
                                        className="text-red-600 cursor-pointer"
                                        onClick={() => handleDelete(contact.id)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal for viewing details */}
            {selectedContact && (
                <Dialog open={!!selectedContact} onOpenChange={closeModal}>
                    <DialogContent className="max-w-md mx-auto p-6">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-semibold">Contact Details</DialogTitle>
                            <DialogDescription className="text-sm text-gray-500">
                                Viewing full details for <span className="font-medium">{selectedContact.name}</span>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div>
                                <p className="text-sm font-medium">Name</p>
                                <p>{selectedContact.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Email</p>
                                <p>{selectedContact.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Phone</p>
                                <p>{selectedContact.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Message</p>
                                <Textarea value={selectedContact.message} disabled className="mt-1" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Date</p>
                                <p>{new Date(selectedContact.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <DialogClose asChild>
                            <Button onClick={closeModal} variant="outline" className="w-full mt-6">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
