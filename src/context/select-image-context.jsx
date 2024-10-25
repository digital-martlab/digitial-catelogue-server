import {
    createContext,
    useCallback,
    useState
} from "react";

export const SelectImagesContext =
    createContext(null);

const SelectImageContextProvider = ({ children }) => {
    const [selectDialogOpen, setSelectDialogOpen] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);

    const handleSelectedImages = useCallback((image) => {
        setSelectedImages((prev) => [...prev, image]);
    }, []);

    const handleDeleteAllSelectedImages = useCallback(() => {
        setSelectedImages([]);
    }, []);

    const handelDeleteSingleSelectedImages = useCallback(
        (image) => {
            setSelectedImages((prev) => {
                const newImages = prev.filter(
                    (img) => img.public_id !== image.public_id,
                );
                return newImages;
            });
        },
        [],
    );

    const handleDialogClose = useCallback(() => {
        setSelectDialogOpen(0);
    }, []);

    return (
        <SelectImagesContext.Provider
            value={{
                selectedImages,
                setSelectedImages,
                setSelectDialogOpen,
                handleSelectedImages,
                handleDeleteAllSelectedImages,
                handelDeleteSingleSelectedImages,
                selectDialogOpen,
                handleDialogClose,
            }}
        >
            {children}
        </SelectImagesContext.Provider>
    );
};

export default SelectImageContextProvider;