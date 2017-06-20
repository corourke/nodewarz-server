import { combineReducers } from "redux-immutable";
import game from "./game"
import nodes from "./nodes"
import connections from "./connections"
import attacks from "./attacks"

const rootReducer = combineReducers({game, nodes, connections, attacks});

export default rootReducer;
