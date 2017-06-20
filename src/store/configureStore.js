import thunk from "redux-thunk"
import {applyMiddleware, createStore} from "redux"
import {composeWithDevTools} from "redux-devtools-extension"
import {fromJS, Map} from "immutable"

import rootReducer from "../reducers/root"
import {INITIAL_STATE} from "../reducers/constants"

let store
export default () => {
    if (store) {
        return store
    }
    store = makeStore()
    return store
};

// To make a new store for testing
// TODO: should initial state have placeholders?
export function makeStore(initialState = INITIAL_STATE) {
    return createStore(
        rootReducer,
        fromJS(initialState),
        composeWithDevTools(
            applyMiddleware(thunk)
        )
    )
}

