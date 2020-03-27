var stateInit = {
    geoLocation: String,
    skyType: String
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
        default:
            return state
    }
}