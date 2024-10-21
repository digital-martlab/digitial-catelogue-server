import { apiRequest } from "@/lib/axios";
import apiAsyncHandle from "@/lib/catch-async-api";
import { enpoints } from "@/lib/endpoints";

export const loginSuperAdminFn = apiAsyncHandle(async (payload) => {
    return apiRequest.post(enpoints.super_admin.login, payload)
})