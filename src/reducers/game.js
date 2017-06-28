import {fromJS, List, Map} from 'immutable'

const INITIAL_STATE = new Map(
    {
        clientId: 0,
        connection: {
            state: "unknown",
            connected: false
        },
        userId: 0
    }
)

export default function reducer(state = INITIAL_STATE, action) {

    // eslint-disable-next-line
    switch (action.type) {
        case 'SET_CLIENT_ID':
            return state.set('clientId', action.clientId)

        case 'SET_CONNECTION_STATE':
            return state.set('connection', Map({
                state: action.state,
                connected: action.connected
            }))

        case 'SET_USER_ID':
            return state.set('userId', action.userId)

        case 'SET_NETWORK':
            return INITIAL_STATE.merge(fromJS(action.network))

    }
    return state
}

/* ACTION CREATORS */

export function setClientId(clientId) {
    return {type: 'SET_CLIENT_ID', clientId}
}

export function setConnectionState(state, connected) {
    return {type: 'SET_CONNECTION_STATE', state, connected}
}

export function setUserId(userId) {
    return {type: 'SET_USER_ID', userId}
}

export function setNetwork(_net) {
    return {type: 'SET_NETWORK', network: _net}
}

