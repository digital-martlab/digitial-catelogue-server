
import { createContext, useCallback, useState } from "react";

export const UploadImagesContext = createContext(undefined);

export default function UploadImagesContextProvider({
    children,
}) {
    const [open, setOpen] = useState(false);
    const [refetch, setRefetch] = useState(null);

    const handleOpenUploadImages = useCallback(() => {
        setOpen(true);
    }, []);

    const handleCloseUploadImages = useCallback(() => {
        setOpen(false);
        setRefetch(null);
    }, []);

    const handleSetRefetch = useCallback((fn) => {
        setRefetch(() => fn);
    }, []);

    return (
        <UploadImagesContext.Provider
            value={{
                open,
                handleOpenUploadImages,
                handleCloseUploadImages,
                handleSetRefetch,
                refetch,
            }}
        >
            {children}
        </UploadImagesContext.Provider>
    );
}