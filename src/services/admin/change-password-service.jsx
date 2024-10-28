import { apiRequest } from "@/lib/axios";
import apiAsyncHandle from "@/lib/catch-async-api";
import { enpoints } from "@/lib/endpoints";

export const passwordChangeAdminFn = apiAsyncHandle(async (payload) => {
    return apiRequest.post(enpoints.admin.password_change, payload)
})