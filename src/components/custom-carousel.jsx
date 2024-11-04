import useCarousel from "@/hooks/use-carousel";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Dialog, DialogContent } from "./ui/dialog";
import { RiCloseFill } from "react-icons/ri";

const CustomCarousel = () => {
    const { images, handleRemoveImages } = useCarousel();

    return (
        <Dialog open={!!images?.length} onOpenChange={handleRemoveImages}>
            <DialogContent className="z-[99999999] flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-300 p-4 md:p-8">
                {/* Close Button */}
                {/* <Button
                    variant="outline"
                    className="rounded-full w-10 h-10 md:w-12 md:h-12 absolute right-4 top-4 md:right-8 md:top-8 z-[10000000]"
                    aria-label="Close Image Carousel"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImages();
                    }}
                >
                    <RiCloseFill className="w-8 h-8 md:w-10 md:h-10" />
                </Button> */}

                {/* Carousel */}
                <Carousel className="w-full max-w-[95vw] overflow-hidden rounded-lg flex items-center justify-center">
                    <CarouselContent className="h-full flex items-center">
                        {images?.map((item, index) => (
                            <CarouselItem key={index} className="flex justify-center items-center">
                                <img
                                    src={item}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-contain rounded-lg shadow-lg"
                                    width={1920}
                                    height={1080}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Carousel Navigation */}
                    {images?.length > 1 && (
                        <>
                            <CarouselPrevious className="absolute left-1 md:left-4 top-1/2 transform -translate-y-1/2 text-white z-[10000000] cursor-pointer p-2 bg-gray-800 bg-opacity-70 rounded-full" />
                            <CarouselNext className="absolute right-1 md:right-4 top-1/2 transform -translate-y-1/2 text-white z-[10000000] cursor-pointer p-2 bg-gray-800 bg-opacity-70 rounded-full" />
                        </>
                    )}
                </Carousel>
            </DialogContent>
        </Dialog>
    );
};

export default CustomCarousel;
