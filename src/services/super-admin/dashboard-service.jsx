import { apiRequest } from "@/lib/axios"
import apiAsyncHandle from "@/lib/catch-async-api"
import { enpoints } from "@/lib/endpoints"

export const getSuperAdminDashboardFn = apiAsyncHandle(async () => {
    return apiRequest.get(enpoints.super_admin.dashboard)
})
