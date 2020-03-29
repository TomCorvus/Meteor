import { GET_GEO_LOCATION, GET_GEO_COORDINATES, GET_SKY_TYPE, GET_API_RESPONSE, GET_DAY_RESPONSE, GET_FORECAST_RESPONSE } from "./MeteorActionsTypes";

export function getGeoLocation(geoLocation) {
    return {
        type: GET_GEO_LOCATION,
        geoLocation: geoLocation
    }
}

export function getGeoCoordinates(geoCoordinates) {
    return {
        type: GET_GEO_COORDINATES,
        geoCoordinates: geoCoordinates
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

export function getApiDayResponse(apiDayResponse) {
    return {
        type: GET_DAY_RESPONSE,
        apiDayResponse: apiDayResponse
    }
}

export function getApiForecastResponse(apiForecastResponse) {
    return {
        type: GET_FORECAST_RESPONSE,
        apiForecastResponse: apiForecastResponse
    }
}