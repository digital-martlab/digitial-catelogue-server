import StoreCart from "@/components/store/store-cart";
import StoreProductDetails from "@/components/store/store-product-details";
import { ProductGridLayout, ProductListLayout } from "@/components/store/store-product-layout";
import StoreSidebar, { StoreSidebarMobile } from "@/components/store/store-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useStore from "@/hooks/use-store";
import { getStoreInfoFn } from "@/services/store/store-service";
import { sampleProducts } from "@/utils/prodcuts";
import { useWindowWidth } from "@react-hook/window-size";
import { LayoutGrid, ShoppingCart, TableCellsSplitIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StoreProductListing() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { setStoreInfo, storeInfo, setCategories, search, setSearch } = useStore();
    const [showCart, setShowCart] = useState(true);
    const onlyWidth = useWindowWidth();
    const [layout, setLayout] = useState('grid');
    const { store_slug } = useParams();
    const [displayProductDetails, setDisplayProductDetails] = useState(null);

    useEffect(() => {
        getStoreInfoFn(store_slug)
            .then(({ data }) => {
                setStoreInfo(data?.store);
                setCategories(data?.categories);
                setLoading(false);
            }).catch(() => {
                navigate("/");
            })
    }, [store_slug, setStoreInfo, setCategories])

    if (loading) {
        return <div>loading...</div>
    }

    return (
        <section className="grid grid-cols-1 lg:grid-cols-[200px_1fr_400px] h-screen overflow-hidden">
            {onlyWidth >= 1024 && <StoreSidebar />}
            <section className="flex flex-col h-full">
                <div className="flex justify-between items-center border-b p-4 h-16">
                    <div className="flex items-center gap-2">
                        <StoreSidebarMobile />
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{storeInfo?.store_name}</h1>
                    </div>
                    <div>
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} className="hidden md:block" placeholder={"search"} />
                        <ShoppingCart className="lg:hidden" onClick={() => setShowCart(!showCart)} />
                    </div>
                </div>
                <div className="p-4 h-[calc(100vh-64px)] overflow-y-auto">
                    {
                        showCart
                            ? (
                                <>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-3xl font-bold">Products</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2">
                                                Sort By:
                                                <div className="flex gap-1 rounded-full border p-1">
                                                    <Button
                                                        className="h-6 w-6 rounded-full"
                                                        variant={layout === 'grid' ? 'default' : 'ghost'}
                                                        onClick={() => setLayout('grid')}
                                                    >
                                                        <LayoutGrid size={6} />
                                                    </Button>
                                                    <Button
                                                        className="h-6 w-6 rounded-full"
                                                        variant={layout === 'list' ? 'default' : 'ghost'}
                                                        onClick={() => setLayout('list')}
                                                    >
                                                        <TableCellsSplitIcon size={6} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-full">
                                        {layout === "grid"
                                            ? <ProductGridLayout products={sampleProducts} setDisplayProductDetails={setDisplayProductDetails} />
                                            : <ProductListLayout products={sampleProducts} setDisplayProductDetails={setDisplayProductDetails} />
                                        }
                                    </div>
                                </>
                            ) : (
                                <StoreCart setShowCart={setShowCart} />
                            )
                    }
                </div>
            </section>
            <div className="hidden lg:block">
                <StoreCart />
            </div>
            <StoreProductDetails item={displayProductDetails} setDisplayProductDetails={setDisplayProductDetails} />
        </section>
    )
}
