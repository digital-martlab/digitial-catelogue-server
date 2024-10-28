import { SelectImagesContext } from "@/context/select-image-context";
import { useContext } from "react";


const useSelectImages = () => {
    const context = useContext(SelectImagesContext);
    if (context === null) {
        throw new Error(
            "useSelectImages must be used within a SelectImagesContextProvider",
        );
    }
    return context;
};

export default useSelectImages;