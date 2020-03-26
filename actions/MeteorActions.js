import { GET_LOCATION } from "./MeteorActionsTypes";

export function getLocation(geolocation) {
    return {
        type: GET_LOCATION,
        geolocation: geolocation
    }
}