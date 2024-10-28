import { apiRequest } from "@/lib/axios"
import apiAsyncHandle from "@/lib/catch-async-api"
import { enpoints } from "@/lib/endpoints"

export const createCouponFn = apiAsyncHandle(async (payload) => {
    return apiRequest.post(enpoints.admin.coupon, payload)
})

export const getAllCouponFn = apiAsyncHandle(async () => {
    return apiRequest.get(enpoints.admin.coupon)
})

export const updateCouponFn = apiAsyncHandle(async (payload) => {
    return apiRequest.patch(enpoints.admin.coupon, payload)
})

export const deleteCouponFn = apiAsyncHandle(async (payload) => {
    return apiRequest.delete(enpoints.admin.coupon, { data: payload })
})