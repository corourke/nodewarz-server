import {fromJS, List} from 'immutable';

const INITIAL_STATE = new List()

export default function reducer(state = INITIAL_STATE, action) {

    // eslint-disable-next-line
    switch (action.type) {
        case 'ADD_CONNECTION':
            const new_conns = state.get("connections").push(fromJS(action.connection));
            return state.merge({connections: new_conns});
    }
    return state;
}

/* ACTION CREATORS */

export function addConnection(_conn) {
    return {type: 'ADD_CONNECTION', connection: _conn}
}
