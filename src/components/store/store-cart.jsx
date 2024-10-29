import useStore from "@/hooks/use-store";
import { showAlert } from "@/lib/catch-async-api";
import { currencyIcon } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { userDetailsSchema } from "@/schemas/cart-shema";
import { applyCouponFn, cartOrderFn } from "@/services/store/store-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, MoveLeft, MoveRight, Plus, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "../ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

const intialCoupon = {
    acc_id: "",
    cpn_discount: 0,
    cpn_id: "",
    cpn_name: ""
}

export default function StoreCart({ setShowCart }) {
    const navigate = useNavigate("");
    const [cartAction, setCartAction] = useState("items");
    const [cartProducts, setCartProducts] = useState([]);
    const { cartItems, setCartItems, products, handleQuantityChange, handelDeleteCartItem, storeInfo, getAllProducts,
        getFilterProducts } = useStore();
    const [search, setSearch] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(intialCoupon);

    const form = useForm({
        resolver: zodResolver(userDetailsSchema),
        defaultValues: {
            name: "",
            phone: "",
            pincode: "",
            address: "",
        },
    });

    const productMapping = useCallback(() => {
        const updatedCartProducts = cartItems.map((cart) => {
            const product = products.find((pr) => cart.product_id === pr.product_id && cart.acc_id === pr.acc_id);
            if (product) {
                const variant = product.variants.find((vr) => vr.variant_id === cart.variant_id);
                return {
                    ...product,
                    variant: variant ? { ...variant } : null,
                    quantity: cart.quantity || 1,
                };
            }
            return null;
        }).filter(Boolean);

        setCartProducts(updatedCartProducts);
    }, [cartItems, products]);

    useEffect(() => {
        productMapping();
    }, [productMapping]);

    const calculateTotalAmount = () => {
        return cartProducts.reduce((total, item) => {
            const price = item?.variant?.price || 0;
            return total + price * item.quantity;
        }, 0);
    };

    const totalAmount = calculateTotalAmount();

    const couponHandleSearch = (e) => {
        setSearch(() => {
            const search = e.target.value;
            applyCouponFn({
                acc_id: storeInfo?.acc_id,
                params: { search }
            })
                .then(data => {
                    if (data?.data) {
                        showAlert(data);
                        setAppliedCoupon(data?.data);
                    } else {
                        setAppliedCoupon(intialCoupon);
                    }
                });
            return search;
        });
    };

    const handleProcess = () => {
        if (cartAction === "items") {
            setCartAction("form");
        }
    };

    const onsubmit = (userDetails) => {
        cartOrderFn({ userDetails, cartItems, totalAmount, storeInfo, ...(appliedCoupon?.cpn_name && { appliedCoupon }) })
            .then((data) => {
                showAlert(data);
                setCartItems([]);
                setCartAction("items");
                getAllProducts();
                getFilterProducts();
                localStorage.removeItem("digital_catelogue_app_cart");
                window.location.href = data?.data;
            })

    }

    return (
        <div className="space-y-4 lg:border-l md:p-6 h-full">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Cart</h3>
                <Button
                    className="lg:hidden"
                    size="sm"
                    onClick={() => setShowCart(prev => !prev)}
                >
                    <MoveLeft /> Back
                </Button>
            </div>
            <div className="flex h-[calc(100vh-180px)] flex-col gap-6 md:h-[calc(100vh-30px)]">
                {cartAction === "items" &&
                    <div className="grid flex-grow grid-cols-1 gap-6 overflow-y-auto pr-4 md:grid-cols-2 lg:grid-cols-1 place-content-start">
                        {cartProducts.map((item) => (
                            <div
                                key={`${item?.variant?.variant_id}-${item?.ctg_id}`}
                                className="flex gap-6 rounded-lg border shadow-md p-4 transition duration-300 hover:shadow-lg self-start bg-card"
                            >
                                <div className="h-24 w-24 rounded-lg overflow-hidden border">
                                    <LazyLoadImage
                                        src={item?.images[0]?.url}
                                        alt="product"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="space-y-2 relative flex-grow">
                                    <p className="text-base font-semibold">{item?.title}</p>
                                    <p className="text-sm">
                                        <span className="font-medium">Variant: </span>
                                        {item?.variant?.variant_title}
                                    </p>
                                    <p className="text-sm">
                                        {currencyIcon}{item?.variant?.price} x {item?.quantity} = {currencyIcon}{(item?.variant?.price * item?.quantity)}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-secondary"
                                            disabled={item.quantity === 1}
                                            onClick={() => handleQuantityChange(item?.product_id, item?.variant?.variant_id, -1)}
                                        >
                                            <Minus size={12} />
                                        </Button>
                                        <Button
                                            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-secondary"
                                            disabled={item?.quantity === item?.variant?.stock}
                                            onClick={() => handleQuantityChange(item?.product_id, item?.variant?.variant_id, 1)}
                                        >
                                            <Plus size={12} />
                                        </Button>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="absolute top-0 right-0 flex items-center justify-center"
                                        onClick={() => handelDeleteCartItem(item?.product_id, item?.variant?.variant_id)}
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                }

                {cartAction === "form" && (
                    <FormProvider {...form}>
                        <form className="space-y-4 p-4 rounded-lg border">
                            <h3 className="text-xl font-semibold">Enter Shipping Details</h3>

                            {/* Individual Form Fields */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Phone" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pincode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pincode</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Pincode" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </FormProvider>
                )}

                <div className="h-[40%] w-full space-y-4">
                    <div className="rounded-lg">
                        <div className="flex justify-between items-end">
                            <span className="font-semibold">Apply Coupon</span>
                            {!!appliedCoupon && <span className="text-xs">Applied {appliedCoupon?.cpn_discount}% Discount</span>}
                        </div>
                        <Input
                            className={cn(
                                "mt-2 px-4 py-2 rounded-lg shadow-sm border border-gray-300",
                                appliedCoupon?.cpn_discount && "border-green-500 border-4",
                            )}
                            value={search}
                            onChange={couponHandleSearch}
                            placeholder="Enter coupon code"
                        />
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-md">
                        <p className="flex items-center justify-between text-sm font-medium">
                            <span>Sub Total</span>
                            <span>{currencyIcon} {totalAmount}</span>
                        </p>
                        <p className="flex items-center justify-between text-sm font-medium">
                            <span>Coupon Applied</span>
                            <span>{currencyIcon} {Math.floor((totalAmount * (appliedCoupon?.cpn_discount / 100)))}</span>
                        </p>
                        <p className="mt-2 flex items-center justify-between text-lg font-bold">
                            <span>Total Amount</span>
                            <span>{currencyIcon} {Math.floor((totalAmount - (totalAmount * (appliedCoupon?.cpn_discount / 100))))}</span>
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {cartAction === "form" &&
                            <Button className="w-full" onClick={() => setCartAction("items")}>
                                <MoveLeft /> Back
                            </Button>
                        }
                        {cartAction === "items" &&
                            <Button Button className="w-full" onClick={handleProcess} disabled={cartItems.length === 0}>
                                Continue <MoveRight />
                            </Button>}
                        {cartAction === "form" &&
                            <Button Button className="w-full" onClick={form.handleSubmit(onsubmit)}>
                                Submit
                            </Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
