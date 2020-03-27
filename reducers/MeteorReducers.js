var stateInit = {
    geoLocation: String,
    skyType: String,
    apiResponse: Number
}

export default function MeteorReducer(state = stateInit, action) {
    switch (action.type) {
        case 'GET_GEO_LOCATION': {
            return {
                ...state,
                geoLocation: action.geoLocation
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
        default:
            return state
    }
}