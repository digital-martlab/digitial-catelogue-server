import { apiRequest } from "@/lib/axios"
import apiAsyncHandle from "@/lib/catch-async-api"
import { enpoints } from "@/lib/endpoints"

export const getStoreInfoFn = apiAsyncHandle(async (payload) => {
    return apiRequest.get(`${enpoints.store.storeInfo}/${payload}`)
})

export const getAllProductsFn = apiAsyncHandle(async (payload) => {
    return apiRequest.get(`${enpoints.store.products}/${payload.acc_id}`, {
        params: payload.params
    })
})

export const getFilteredProductsFn = apiAsyncHandle(async (payload) => {
    return apiRequest.get(`${enpoints.store.filteredProducts}/${payload.acc_id}`, {
        params: payload.params
    })
})

export const applyCouponFn = apiAsyncHandle(async (payload) => {
    return apiRequest.get(`${enpoints.store.coupon}/${payload.acc_id}`, {
        params: payload.params
    })
})

export const cartOrderFn = apiAsyncHandle(async (payload) => {
    return apiRequest.post(enpoints.store.order, payload);
})