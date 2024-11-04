import { WindowLoading } from "@/components/loading-spinner";
import StoreCart from "@/components/store/store-cart";
import StoreProductDetails from "@/components/store/store-product-details";
import { ProductGridLayout, ProductListLayout } from "@/components/store/store-product-layout";
import StoreSidebar, { StoreSidebarMobile } from "@/components/store/store-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useStore from "@/hooks/use-store";
import { useTheme } from "@/hooks/use-theme";
import { getStoreInfoFn } from "@/services/store/store-service";
import { useWindowWidth } from "@react-hook/window-size";
import { LayoutGrid, ShoppingCart, TableCellsSplitIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";

export default function StoreProductListing() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { setTheme, setColor } = useTheme();
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
                setTheme(data?.store?.theme_mod);
                setColor(data?.store?.theme_color);
                setLoading(false);
            }).catch(() => {
                navigate("/");
            })
    }, [store_slug, setStoreInfo, setCategories, navigate, setTheme, setColor])

    if (loading) {
        return <WindowLoading />;
    }

    return (
        <section className="grid grid-cols-1 lg:grid-cols-[200px_1fr_400px] h-screen overflow-hidden bg-background">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{storeInfo?.store_name} - CatelogueWala</title>
                <link rel="canonical" href={window.location.href} />
                <link rel="icon" type="image/svg+xml" href={storeInfo?.logo} />
                <meta
                    property="og:title"
                    content={`${storeInfo?.store_name} - CatelogueWala`}
                />
                <meta property="og:image" content={storeInfo?.logo} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content={`${storeInfo?.store_name} - CatelogueWala`}
                />
                <meta name="twitter:image" content={storeInfo?.logo} />
            </Helmet>
            {onlyWidth >= 1024 && <StoreSidebar />}
            <section className="flex flex-col h-full">
                <div className="flex justify-between items-center border-b p-4 h-16">
                    <div className="flex items-center gap-2">
                        <StoreSidebarMobile />
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{storeInfo?.store_name}</h1>
                    </div>
                    <div className="flex items-center gap-2">
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
                                        <h3 className="text-3xl font-bold text-primary">Products</h3>
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
                                            ? <ProductGridLayout setDisplayProductDetails={setDisplayProductDetails} />
                                            : <ProductListLayout setDisplayProductDetails={setDisplayProductDetails} />
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
