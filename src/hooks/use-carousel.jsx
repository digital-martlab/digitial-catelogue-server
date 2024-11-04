import { CarousalContext } from "@/context/carousel-context";
import { useContext } from "react";

// Create a custom hook to use the CarousalContext
const useCarousal = () => {
    const context = useContext(CarousalContext);
    if (context === null) {
        throw new Error(
            "useCarousal must be used within a CarousalContextProvider",
        );
    }
    return context;
};

export default useCarousal;