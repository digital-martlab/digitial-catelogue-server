import { StoreContext } from "@/context/store-context";
import { useContext } from "react";


const useStore = () => {
    const context = useContext(StoreContext);
    if (context === null) {
        throw new Error(
            "useStore must be used within a StoreContextProvider",
        );
    }
    return context;
};

export default useStore;