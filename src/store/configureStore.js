import thunk from "redux-thunk"
import {applyMiddleware, createStore} from "redux"
import {composeWithDevTools} from "redux-devtools-extension"
import {Map} from "immutable"

import rootReducer from "../reducers/root"

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
export function makeStore(initialState = new Map()) {
    return createStore(
        rootReducer,
        initialState,
        composeWithDevTools(
            applyMiddleware(thunk)
        )
    )
}

