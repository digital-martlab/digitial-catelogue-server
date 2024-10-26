import useAuth from "@/hooks/use-auth";
import useSelectImages from "@/hooks/use-select-image";
import useUploadImages from "@/hooks/use-upload-image";
import { showAlert } from "@/lib/catch-async-api";
import { ROLES } from "@/lib/roles";
import { deleteGalleryFn, getAllGalleyFn } from "@/services/admin/gallery-service";
import { Trash, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "./loading-spinner";
import NotFound from "./not-found";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export default function SelectedImages() {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [onlyFirstTime, setOnlyFirstTime] = useState(true);
    const { auth } = useAuth();
    const {
        selectDialogOpen,
        handleDialogClose,
        handleSelectedImages,
        selectedImages,
        handelDeleteSingleSelectedImages,
    } = useSelectImages();
    const { handleOpenUploadImages, handleSetRefetch } = useUploadImages();

    // Fetch gallery images
    const getGalleries = useCallback(() => {
        setLoading(true);
        getAllGalleyFn()
            .then((data) => {
                setImages(data?.data || []);
            })
            .catch((error) => {
                console.error("Error fetching gallery images:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Fetch galleries only the first time for Admin role
    useEffect(() => {
        if (auth && auth?.role === ROLES.ADMIN && onlyFirstTime) {
            getGalleries();
            setOnlyFirstTime(false);
        }
    }, [getGalleries, onlyFirstTime, auth]);

    // Handle deleting a gallery image
    const handleDelete = ({ public_id }) => {
        deleteGalleryFn({ public_id })
            .then((data) => {
                showAlert(data);
                // If the image is selected, remove it from selectedImages
                const isSelected = selectedImages.some((img) => img.public_id === public_id);
                if (isSelected) {
                    handelDeleteSingleSelectedImages({ public_id });
                }
                getGalleries();
            })
            .catch((error) => console.error("Error deleting image:", error));
    };

    // Handle checkbox state changes
    const handleCheckboxChange = (checked, img) => {
        if (checked) {
            if (selectedImages.length < selectDialogOpen) handleSelectedImages(img);
        } else {
            handelDeleteSingleSelectedImages(img);
        }
    };
    return (
        <Dialog open={!!selectDialogOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="max-w-[800px] w-full p-4">
                <DialogHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <DialogTitle className="text-xl">Select Images</DialogTitle>
                            <DialogDescription>
                                Choose images from your gallery or upload new ones.
                            </DialogDescription>
                        </div>
                        <Button
                            variant="outline"
                            className="flex justify-center gap-2 items-center mr-6"
                            onClick={() => {
                                handleSetRefetch(getGalleries);
                                handleOpenUploadImages();
                            }}
                        >
                            <Upload className="w-4 h-4 " /> Upload Images
                        </Button>
                    </div>
                </DialogHeader>

                <div className="mt-4">
                    {selectedImages.length > 0 && (
                        <Carousel className="mb-6">
                            <CarouselContent>
                                {selectedImages.map((img) => (
                                    <CarouselItem
                                        className="basis-1/2 lg:basis-1/4 max-w-[180px]"
                                        key={img?.url}
                                    >
                                        <div
                                            className="relative w-full aspect-square overflow-hidden rounded-lg cursor-pointer group"
                                        >
                                            <img
                                                src={img?.url}
                                                alt={`Selected image ${img?._id}`}
                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 group-hover:grayscale"
                                            />
                                            <div className="absolute top-1 right-1">
                                                <div
                                                    className="hidden group-hover:flex items-center justify-center w-6 h-6 bg-red-900 rounded-md transition-opacity duration-300 cursor-pointer"
                                                    onClick={() => handelDeleteSingleSelectedImages(img)}
                                                >
                                                    <Trash className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <h4 className="text-xl mb-4">Gallery Images</h4>
                            {images.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4 max-h-[500px] overflow-y-scroll">
                                    {images.map((img) => (
                                        <div
                                            key={img?.url}
                                            className="relative w-full aspect-square overflow-hidden rounded-lg cursor-pointer group shadow-sm hover:shadow-lg"
                                        >
                                            <img
                                                src={img?.url}
                                                alt={`Gallery image ${img?._id}`}
                                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 group-hover:grayscale"
                                            />
                                            <Checkbox
                                                className="absolute left-1 bottom-1 w-6 h-6 bg-card border rounded-md"
                                                checked={selectedImages.some(
                                                    (selected) => selected?.public_id === img?.public_id,
                                                )}
                                                onCheckedChange={(checked) =>
                                                    handleCheckboxChange(checked, img)
                                                }
                                            />
                                            <div className="absolute top-1 right-1">
                                                <div
                                                    className="hidden group-hover:flex items-center justify-center w-6 h-6 bg-red-900 rounded-md transition-opacity duration-300 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(img);
                                                    }}
                                                >
                                                    <Trash className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <NotFound className="mx-auto w-1/2" />
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
