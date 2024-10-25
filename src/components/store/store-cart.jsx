import { MoveLeft } from "lucide-react";
import { Button } from "../ui/button";
import { sampleProducts } from "@/utils/prodcuts";
import { priceIcon } from "@/utils/constants";
import { Input } from "../ui/input";


export default function StoreCart({ setShowCart }) {
    return (
        <div className="space-y-4 lg:border-l p-4 h-full">
            <div className="flex justify-between">
                <h3 className='text-2xl font-bold'>Cart</h3>
                <Button
                    className="lg:hidden"
                    size={'sm'}
                    onClick={() => {
                        if (setShowCart) setShowCart(prev => !prev);
                    }}
                >
                    <MoveLeft /> Back
                </Button>
            </div>
            {/* Main container with fixed layout */}
            <div className="flex h-[calc(100vh-170px)] flex-col gap-4 md:h-[calc(100vh-70px)]">
                <div className="grid flex-grow grid-cols-1 gap-4 overflow-y-auto pr-4 md:grid-cols-2 lg:grid-cols-1">
                    {sampleProducts.map((item) => (
                        <div
                            key={item.product_id}
                            className="flex gap-4 rounded-lg border bg-card p-4"
                        >
                            <div className="h-20 w-20 rounded-lg border">
                                <img
                                    src={item?.product_images[0]}
                                    alt="product"
                                    width={80}
                                    height={80}
                                    className="rounded-lg object-cover"
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-bold">{item?.name}</p>
                                <p>
                                    {priceIcon}
                                    {item?.product_variants[0]?.price}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom section taking the remaining space */}
                <div className="h-[40%] w-full space-y-4">
                    <div className="bg-card">
                        <span>Apply Coupon</span>
                        <Input placeholder="Apply Coupan" className="mt-2" />
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <p className="flex items-center justify-between text-sm">
                            <span>Sub Total</span>
                            <span>{priceIcon} 123</span>
                        </p>
                        <p className="flex items-center justify-between text-sm">
                            <span>Coupan</span>
                            <span>{priceIcon} 123</span>
                        </p>
                        <p className="flex items-center justify-between text-sm">
                            <span>Shipping</span>
                            <span>{priceIcon} 123</span>
                        </p>
                        <p className="flex items-center justify-between text-sm">
                            <span>GST</span>
                            <span>{priceIcon} 123</span>
                        </p>
                        <p className="mt-2 flex items-center justify-between text-lg">
                            <span>Total Amount</span>
                            <span>{priceIcon} 123</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
