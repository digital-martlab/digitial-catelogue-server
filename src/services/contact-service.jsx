import { apiRequest } from "@/lib/axios"
import apiAsyncHandle from "@/lib/catch-async-api"
import { enpoints } from "@/lib/endpoints"

export const createContactFn = apiAsyncHandle(async (payload) => {
    return apiRequest.post(enpoints.home.contact, payload)
})

export const getAllContactsFn = apiAsyncHandle(async (payload) => {
    return apiRequest.get(enpoints.home.contact, {
        params: payload
    })
})


export const deleteContactFn = apiAsyncHandle(async (payload) => {
    return apiRequest.delete(enpoints.home.contact, { data: payload })
})