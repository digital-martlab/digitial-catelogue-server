import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

const apiAsyncHandle =
    (fn) => async (args) => {
        try {
            const { data } = await fn(args);
            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast({
                    title: "Failed",
                    description:
                        error?.response?.data?.message ||
                        error.message ||
                        "An unexpected error occurred.",
                });
            } else {
                toast({
                    title: "Failed",
                    description: "An unexpected error occurred.",
                });
            }
            throw error;
        }
    };

export const showAlert = (data, isFailed = false) => {
    toast({
        title: isFailed ? "Failed" : "Success",
        description: data?.message,
    });
};

export default apiAsyncHandle;