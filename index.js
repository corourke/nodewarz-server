import getStore from './src/store/configureStore';
import { startServer } from './src/server/server';
import { nodesUnderAttack, applyAttackCycle, removeAttacks } from './src/reducers/attacks'


export const store = getStore();
var io = startServer(store);


export function sendAction(action) {
    io.emit('action', action);
}

// store.subscribe(
//     // TODO: can we just emit changed state?
//     () => io.emit('state', store.getState().toJS())
// )

var timer = setInterval(function() {
    var attackList = nodesUnderAttack(store)
    if(attackList.size !== 0) {  // onFrame
        console.log("attack cycle")
        attackList.forEach((targetNodeId) => {
            if (applyAttackCycle(store, targetNodeId)) {
                store.dispatch(removeAttacks(targetNodeId))
            }
        })
        //io.emit('state', store.getState().toJS()) // TODO: temp - remove
    }
},1000)


