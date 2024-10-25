
import { UploadImagesContext } from "@/context/upload-image-context";
import { useContext } from "react";

export default function useUploadImages() {
    const context = useContext(UploadImagesContext);

    if (!context)
        throw new Error(
            "useUploadImage must be used within a CarousalContextProvider",
        );

    return context;
}