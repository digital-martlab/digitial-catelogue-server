import { apiRequest, multpartHeader } from "@/lib/axios"
import apiAsyncHandle from "@/lib/catch-async-api"
import { enpoints } from "@/lib/endpoints"

export const createStoreFn = apiAsyncHandle(async (payload) => {
    return apiRequest.post(enpoints.super_admin.store, payload, {
        headers: multpartHeader
    })
})

export const getAllStoresFn = apiAsyncHandle(async (payload) => {
    return apiRequest.get(enpoints.super_admin.store, {
        params: payload
    })
})

export const updateStoreStatusFn = apiAsyncHandle(async (payload) => {
    return apiRequest.post(`${enpoints.super_admin.store}/${payload}`)
})

export const getSingleStoreFn = apiAsyncHandle(async (payload) => {
    return apiRequest.get(`${enpoints.super_admin.store}/${payload}`)
})

export const updateSingleStoreFn = apiAsyncHandle(async ({ store_id, formData }) => {
    return apiRequest.patch(`${enpoints.super_admin.store}/${store_id}`, formData, {
        headers: multpartHeader
    })
})
export const deletSingleStoreFn = apiAsyncHandle(async (payload) => {
    return apiRequest.delete(enpoints.super_admin.store, { data: payload })
})