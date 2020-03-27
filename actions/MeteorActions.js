import { GET_GEO_LOCATION, GET_SKY_TYPE } from "./MeteorActionsTypes";

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