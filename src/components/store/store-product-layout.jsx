
import { priceIcon } from '@/utils/constants';
import { Button } from '../ui/button';
import { sampleProducts } from '@/utils/prodcuts';

export function ProductGridLayout({ setDisplayProductDetails }) {
    return (
        <div className="grid gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {sampleProducts.map((item) => (
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
                            src={item.product_images[0].url}
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
                            {item.product_variants[0].price}
                        </p>
                        <Button className="w-full" size={'sm'}>
                            Add To Cart
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ProductListLayout(setDisplayProductDetails) {
    return (
        <div className="flex flex-col gap-4 pt-4">
            {sampleProducts.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-4 rounded-lg border p-4">
                    <div className="h-40 w-40 rounded-lg border">
                        <img src={item?.product_images[0]?.url} alt="product" width={300} height={400} />
                    </div>
                    <div className="flex-1 space-y-2">
                        <p className="flex gap-2">
                            <span className="rounded-sm bg-accent px-2 py-1 text-xs">{item?.ctg_name}</span>
                        </p>
                        <p
                            className="cursor-pointer text-base font-bold md:text-2xl"
                            onClick={() => setDisplayProductDetails(item)}
                        >
                            {item?.title}
                        </p>
                        <p>
                            {priceIcon}
                            {item?.product_variants[0]?.price}
                        </p>
                        <Button size={'sm'}>Add to Cart</Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
