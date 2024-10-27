"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Title from "@/components/ui/title";
import { showAlert } from "@/lib/catch-async-api";
import generateStoreID from "@/lib/store-id-generator";
import { storeShema } from "@/schemas/store-schema";
import {
    createStoreFn,
    getSingleStoreFn,
    updateSingleStoreFn,
} from "@/services/super-admin/store-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateUpdateStore() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { status, store_id } = useParams();
    const defaultValues = useMemo(
        () => ({
            name: "",
            email: "",
            number: "",
            store_name: "",
            store_id: status === "add" ? generateStoreID() : "",
            ...(status === "add" && { password: generateStoreID().split("-")[1] }),
        }),
        [status]
    );
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);

    // React Hook Form setup
    const form = useForm({
        resolver: zodResolver(storeShema),
        defaultValues,
    });

    // Handle form submission
    const onSubmit = async (data) => {
        const formData = new FormData();

        // Append form data fields
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("number", data.number);
        formData.append("store_name", data.store_name);
        formData.append("store_id", data.store_id);

        setLoading(true);
        if (status === "add") {
            formData.append("password", data.password);
            if (!file) {
                setLoading(false);
                return showAlert({ message: "Image is required" }, true);
            }
            formData.append("logo", file);
            createStoreFn(formData)
                .then((data) => {
                    navigate("/super-admin/stores");
                    showAlert(data);
                })
                .finally(() => setLoading(false));
        } else {
            if (file) formData.append("logo", file);
            updateSingleStoreFn({ store_id, formData })
                .then((data) => {
                    navigate("/super-admin/stores");
                    showAlert(data);
                })
                .finally(() => setLoading(false));
        }
    };

    // Handle image preview
    const handleImage = (e) => {
        const file = e.target?.files?.[0];
        if (file) {
            setFile(file);
            const url = URL.createObjectURL(file);
            setImage(url);
        }
    };

    useEffect(() => {
        if (status === "update" && store_id) {
            getSingleStoreFn(store_id).then(({ data }) => {
                form.reset({
                    name: data?.name,
                    email: data?.email,
                    number: data?.number,
                    store_name: data?.store_name,
                    store_id: data?.store_id,
                });
                setImage(data?.logo);
            });
        }
    }, [form, status, store_id]);

    return (
        <div className="max-w-[1000px] mx-auto">
            <Title title={status === "add" ? "Add New Store" : "Update Store"} />
            <div className="mt-8">
                <div className="relative group w-28 h-28 overflow-hidden rounded-sm border-2 border-primary bg-card">
                    <img
                        src={image || "https://placehold.co/100x100?text=logo+here"}
                        alt="Store logo"
                        className="w-full h-full object-contain"
                    />
                    <label
                        htmlFor="input_image"
                        className="absolute inset-0 bg-card bg-opacity-40 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                        <CameraIcon className="w-8 h-8 text-white" />
                    </label>
                    <Input
                        type="file"
                        accept="image/*"
                        id="input_image"
                        className="hidden"
                        onChange={handleImage}
                    />
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-4 space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Store Owner Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Owner Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contact Number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="store_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Store Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Store Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="store_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Store ID</FormLabel>
                                        <FormControl>
                                            <Input disabled placeholder="Store ID" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {status === "add" && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Store Password</FormLabel>
                                            <FormControl>
                                                <Input disabled {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <Button type="submit">{loading ? "Saving..." : "Save"}</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
