import { apiRequest } from "@/lib/axios";
import apiAsyncHandle from "@/lib/catch-async-api";
import { enpoints } from "@/lib/endpoints";

export const createProductAdminFn = apiAsyncHandle(async (payload) => {
    return apiRequest.post(enpoints.admin.product, payload)
})

export const getAllProductAdminFn = apiAsyncHandle(async (payload) => {
    return apiRequest.get(enpoints.admin.product, { params: payload })
})

export const productActiveStatusFn = apiAsyncHandle(async (payload) => {
    return apiRequest.put(enpoints.admin.product, payload)
})

export const deleteProductFn = apiAsyncHandle(async (payload) => {
    return apiRequest.delete(enpoints.admin.product, { data: payload })
})