import { GET_GEO_LOCATION, GET_SKY_TYPE, GET_API_RESPONSE } from "./MeteorActionsTypes";

export function getGeoLocation(geoLocation) {
    return {
        type: GET_GEO_LOCATION,
        geoLocation: geoLocation
    }
}

export function getSkyType(skyType) {
    return {
        type: GET_SKY_TYPE,
        skyType: skyType
    }
}

export function getApiResponse(apiResponse) {
    return {
        type: GET_API_RESPONSE,
        apiResponse: apiResponse
    }
}