import { apiRequest } from "@/lib/axios"
import apiAsyncHandle from "@/lib/catch-async-api"
import { enpoints } from "@/lib/endpoints"

export const getThemeFn = apiAsyncHandle(async (payload) => {
    return apiRequest.get(enpoints.admin.theme, payload)
})

export const updateThemeFn = apiAsyncHandle(async (payload) => {
    return apiRequest.patch(enpoints.admin.theme, payload)
})