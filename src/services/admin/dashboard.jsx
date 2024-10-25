import { apiRequest } from "@/lib/axios"
import apiAsyncHandle from "@/lib/catch-async-api"
import { enpoints } from "@/lib/endpoints"

export const getDashboardFn = apiAsyncHandle(async () => {
    return apiRequest.get(enpoints.admin.dashboard)
})