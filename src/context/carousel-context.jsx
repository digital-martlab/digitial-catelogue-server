import { useState, createContext, useCallback } from "react";

export const CarousalContext = createContext(null);

export default function CarousalContextProvider({ children }) {
    const [images, setImages] = useState(null);

    const handleSetImages = useCallback((images, index) => {
        if (index !== undefined) {
            const selectedOne = images.find((_, idx) => index === idx);
            setImages([selectedOne, ...images]);
        } else {
            setImages(images);
        }
    }, []);

    const handleRemoveImages = useCallback(() => {
        setImages(null);
    }, []);

    const value = {
        images,
        handleSetImages,
        handleRemoveImages,
    };

    return (
        <CarousalContext.Provider value={value}>
            {children}
        </CarousalContext.Provider>
    );
}