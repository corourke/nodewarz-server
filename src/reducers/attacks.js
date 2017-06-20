import {fromJS, List, Map} from 'immutable';
import {getNode, setNodeProps} from "./nodes"
import pf from "pretty-immutable"

const INITIAL_STATE = new List()

export default function reducer(state = INITIAL_STATE, action) {

    // eslint-disable-next-line
    switch (action.type) {

        case 'NEW_ATTACK':
            // TODO: should we check that attack is not already in the list?
            // TODO: Check that the attack is along a connection
            return state.push(action.attack)

        case 'RESET_ATTACKS':
            return new List();

        case 'REMOVE_ATTACKS':
            return state.filter((m) => m.get('targetNodeId') !== action.nodeId)

    }
    return state;
}

/* ACTION CREATORS */

export function resetAttacks() {
    return {type: 'RESET_ATTACKS'}
}

export function newAttack(attackerId, targetId) {
    let newAttack = Attack(attackerId, targetId)
    return {type: 'NEW_ATTACK', attack: newAttack}
}

export function removeAttacks(_nodeId) {
    return {type: 'REMOVE_ATTACKS', nodeId: _nodeId};
}


/* UTILITY */

export function Attack(attacker, target) {
    return fromJS({attackNodeId: attacker, targetNodeId: target})
}



/* SELECTORS */

export function getAttacksList(state) {
    if (List.isList(state)) {
        return state                // Assume a list of nodes
    } else if (Map.isMap(state)) {
        return state.get('attacks')   // Assume redux state
    } else {                        // Assume redux store
        return state.getState().get('attacks')
    }
}

// Get array of attacks
export function getAttacks(_store) {
    const attackList = getAttacksList(_store)
    return attackList;
}

// Returns true if the attack and target Nodes are already in the attackList
export function attackInProgress(_store, attackerId, targetId) {
    var attacks = getAttacks(_store);
    if (attacks.size === 0) return false;
    return attacks.includes(Attack(attackerId, targetId));
}

// Return an array of nodes that are under attack
export function nodesUnderAttack(_store) {
    return getAttacks(_store).reduce((list, attack) => {
        let target = attack.get('targetNodeId');
        return (!list.includes(target)) ? list.push(target) : list;
    }, List([]));
}

export function applyAttackCycle(_store, nodeId) {
    var t = getNode(_store, nodeId).toJS(); // targetNode

    function apply_attack(attack) {  // apply one attack
        var a = getNode(_store, attack.get('attackNodeId')).toJS(); // attackingNode
        // console.log("1 node: " + nodeId + " health: " + health + " owner: " + ownerId + " attackOwnerId: " + attackOwnerId + " with: " + power);

        // If we own the node support it, otherwise attack it
        t.owner === a.owner ? t.health += a.power : t.health -= a.power

        // If the health drops below zero, switch owners and reverse the health
        if( t.health < 0 ) { t.owner = a.owner; t.health = -t.health }
        // console.log("2 node: " + nodeId + " health: " + health + " owner: " + ownerId );
        // console.log(" ");
    }

    // get the attacks against this node, and apply each attack
    getAttacks(_store)
        .filter((attack) => attack.get('targetNodeId') === t.id)
        .forEach( (a) => apply_attack(a) )

    // If the health goes above the size, cap it
    // important: do it here and not for each attack or attack will never finish in some cases
    if( t.health > t.size ) { t.health = t.size }

    // Update store with results
    _store.dispatch(setNodeProps({id: t.id, owner: t.owner, health: t.health}))

    // return true means that node is at full health (conquered)
    return (t.health === t.size)
}
