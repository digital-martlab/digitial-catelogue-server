import { apiRequest } from "@/lib/axios"
import apiAsyncHandle from "@/lib/catch-async-api"
import { enpoints } from "@/lib/endpoints"

export const createProductCategoryFn = apiAsyncHandle(async (payload) => {
    return apiRequest.post(enpoints.admin.category, payload)
})

export const getAllProductCategoryFn = apiAsyncHandle(async () => {
    return apiRequest.get(enpoints.admin.category)
})

export const updateProductCategoryFn = apiAsyncHandle(async (payload) => {
    return apiRequest.patch(enpoints.admin.category, payload)
})

export const deleteProductCategoryFn = apiAsyncHandle(async (payload) => {
    return apiRequest.delete(enpoints.admin.category, { data: payload })
})