import { apiRequest, multpartHeader } from "@/lib/axios"
import apiAsyncHandle from "@/lib/catch-async-api"
import { enpoints } from "@/lib/endpoints"

export const uploadGalleryFn = apiAsyncHandle(async (payload) => {
    return apiRequest.post(enpoints.admin.gallery, payload, {
        headers: multpartHeader
    })
})

export const getAllGalleyFn = apiAsyncHandle(async () => {
    return apiRequest.get(enpoints.admin.gallery)
})

export const deleteGalleryFn = apiAsyncHandle(async (payload) => {
    return apiRequest.delete(enpoints.admin.gallery, { data: payload })
})