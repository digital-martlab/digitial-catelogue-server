import { Minus } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import useUploadImages from "@/hooks/use-upload-image";
import { uploadGalleryFn } from "@/services/admin/gallery-service";
import { Button } from "./ui/button";
import { showAlert } from "@/lib/catch-async-api";

export default function UploadImages() {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const { open, handleCloseUploadImages, refetch } = useUploadImages();

    // Handle file input change
    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const fileArray = Array.from(selectedFiles);
            setFiles([...fileArray, ...files]);

            const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
            setImages([...imageUrls, ...images]);
        }
    };

    // Handle image removal
    const handleRemoveImage = (index) => {
        const updatedImages = images.filter((_, idx) => idx !== index);
        const updatedFiles = files.filter((_, idx) => index !== idx);
        setImages(updatedImages);
        setFiles(updatedFiles);
    };

    const uploadImages = async () => {
        setLoading(true);
        const formData = new FormData();
        files.forEach((file, idx) => formData.append(`images[${idx}]`, file));
        uploadGalleryFn(formData)
            .then((data) => showAlert(data))
            .then(() => {
                setFiles([]);
                setImages([]);
                if (refetch) refetch();
                handleCloseUploadImages();
            })
            .finally(() => setLoading(false));
    };

    return (
        <Dialog open={open} onOpenChange={handleCloseUploadImages}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Images</DialogTitle>
                    <DialogDescription>
                        Select multiple images to upload
                    </DialogDescription>
                </DialogHeader>
                <p className="text-xs text-red-500">Images must be less than 500kb.</p>
                {/* File Input */}
                <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />

                {/* Render selected images */}
                {images.length > 0 && (
                    <div className="mt-4 max-h-[500px] overflow-y-scroll">
                        <div className="grid grid-cols-3 gap-2">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative w-full aspect-square overflow-hidden rounded-lg cursor-pointer group"
                                >
                                    <img
                                        src={img}
                                        alt={`Selected image ${index}`}
                                        className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:grayscale w-full h-full"
                                    />
                                    <div className="absolute top-1 right-1 transition-transform duration-200">
                                        <div
                                            className="hidden group-hover:flex items-center justify-center w-6 h-6 bg-red-900 rounded-md transition-opacity duration-300 cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveImage(index);
                                            }}
                                        >
                                            <Minus className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <DialogFooter className={"grid grid-cols-1 md:grid-cols-2 gap-4"}>
                    {images?.length > 0 && (
                        <Button
                            variant={"destructive"}
                            onClick={() => {
                                setFiles([]);
                                setImages([]);
                            }}
                        >
                            Clear
                        </Button>
                    )}
                    <Button
                        type="submit"
                        onClick={uploadImages}
                        disabled={files.length === 0}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}