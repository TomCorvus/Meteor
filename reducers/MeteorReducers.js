var stateInit = {
    geolocation: ""
}

export default function MeteorReducer(state = stateInit, action) {
    switch (action.type) {
        case 'GET_LOCATION': {
            return {
                ...state,
                geolocation: action.geolocation
            }
        }
        default:
            return state
    }
}