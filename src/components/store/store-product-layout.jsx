import useStore from '@/hooks/use-store';
import { priceIcon } from '@/utils/constants';
import { Button } from '../ui/button';

export function ProductGridLayout({ setDisplayProductDetails }) {
    const { filteredProducts, handleSetCartItem } = useStore();

    return (
        <div className="grid gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredProducts.map((item) => (
                <div
                    key={item.product_id}
                    className="relative z-0 rounded-lg border bg-card"
                >
                    <span className="absolute left-2 top-2 rounded-lg bg-accent px-2 py-1 text-xs">
                        {item.ctg_name}
                    </span>
                    <div className="h-40">
                        <img
                            alt={item.title}
                            src={item.images?.[0]?.url}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="space-y-2 p-4 text-center">
                        <p
                            className="w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold"
                            onClick={() => {
                                setDisplayProductDetails(item);
                            }}
                        >
                            {item.title}
                        </p>
                        <p>
                            {priceIcon}
                            {item?.variants?.[0]?.price}
                        </p>
                        <Button
                            className="w-full"
                            size="sm"
                            disabled={item?.variants?.[0]?.stock === 0}
                            onClick={() => {
                                handleSetCartItem({
                                    product_id: item.product_id,
                                    variant_id: item.variants?.[0]?.variant_id,
                                    acc_id: item?.acc_id
                                })
                            }}
                        >
                            Add To Cart
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ProductListLayout({ setDisplayProductDetails }) {
    const { filteredProducts, handleSetCartItem } = useStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {filteredProducts.map((item) => (
                <div key={item?.product_id} className="flex gap-4 rounded-lg border p-4">
                    <div className="h-40 w-40 rounded-lg border">
                        <img src={item?.images?.[0]?.url} alt="product" className='w-full h-full object-contain' />
                    </div>
                    <div className="flex-1 space-y-2">
                        <p className="flex gap-2">
                            <span className="rounded-sm bg-accent px-2 py-1 text-xs">
                                {item?.ctg_name}
                            </span>
                        </p>
                        <p
                            className="cursor-pointer text-base font-bold md:text-2xl"
                            onClick={() => setDisplayProductDetails(item)}
                        >
                            {item?.title}
                        </p>
                        <p>
                            {priceIcon}
                            {item?.variants[0]?.price}
                        </p>
                        <Button
                            size="sm"
                            disabled={item?.variants?.[0]?.stock === 0}
                            onClick={() => handleSetCartItem({
                                product_id: item.product_id,
                                variant_id: item.variants?.[0]?.variant_id,
                                acc_id: item?.acc_id
                            })}
                        >
                            Add to Cart
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
