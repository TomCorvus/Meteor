var stateInit = {
    geoLocation: String,
    geoCoordinates: "",
    skyType: String,
    apiResponse: -1,
    apiDayResponse: -1,
    apiForecastResponse: -1,
}

export default function MeteorReducer(state = stateInit, action) {
    switch (action.type) {
        case 'GET_GEO_LOCATION': {
            return {
                ...state,
                geoLocation: action.geoLocation
            }
        }
        case 'GET_GEO_COORDINATES': {
            return {
                ...state,
                geoCoordinates: action.geoCoordinates
            }
        }
        case 'GET_SKY_TYPE': {
            return {
                ...state,
                skyType: action.skyType
            }
        }
        case 'GET_API_RESPONSE': {
            return {
                ...state,
                apiResponse: action.apiResponse
            }
        }
        case 'GET_DAY_RESPONSE': {
            return {
                ...state,
                apiDayResponse: action.apiDayResponse
            }
        }
        case 'GET_FORECAST_RESPONSE': {
            return {
                ...state,
                apiForecastResponse: action.apiForecastResponse
            }
        }
        default:
            return state
    }
}