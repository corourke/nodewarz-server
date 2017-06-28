import thunk from "redux-thunk"
import {applyMiddleware, createStore} from "redux"
import {composeWithDevTools} from "redux-devtools-extension"
import {fromJS, Map} from "immutable"
import {sendAction} from "../../index.js"

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
            applyMiddleware(propagateActions)
        )
    )
}

const propagateActions = store => next => action => {
    // Before action.
    console.log("Before action: " + JSON.stringify(action))

    let result = next(action)
    // After action. To see result of the current action store.getState()

    switch(action.type) {
        case 'ADD_NODE':
        case 'SET_NODE_PROPS':
        case 'RESET_ATTACKS':
        case 'REMOVE_ATTACKS':
            sendAction(action)
    }

    return result
}

