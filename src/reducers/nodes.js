import {Map, List, fromJS} from "immutable"
import pf from "pretty-immutable"

const INITIAL_STATE = fromJS(new List())

const DEFAULT_NODE = fromJS({
    id: 0,
    size: 30,
    health: 0,
    power: 3,
    owner: 0,
    x: 100,
    y: 100,
    selected: false
})

export default function reducer(state = INITIAL_STATE, action) {
    // eslint-disable-next-line
    switch (action.type) {
        case 'ADD_NODE':
            const node = DEFAULT_NODE.merge(action.node)
            const node2 = (node.get('id') === 0) ? node.set('id', nextNodeId(state)) : node
            return state.push(Map(node2))

        case 'SET_NODE_SELECTED':
            return state.setIn([findNode(state, action.nodeId), 'selected'], !!(action.state))

        case 'TOGGLE_NODE_SELECTED':
            let index = findNode(state, action.nodeId)
            let selectState = index === -1 ? false : state.getIn([index, 'selected'])
            return state.setIn([index, 'selected'], !(selectState))

        case 'SET_NODE_PROPS':
            const nodeIndex = findNode(state, fromJS(action.nodeProps).get('id'))
            return state.mergeDeepIn([nodeIndex], action.nodeProps)

    }
    return state
}

/* ACTION CREATORS */


export function addNode(_node) {
    return {type: 'ADD_NODE', node: _node}
}

export function setNodeProps(_np) {
    return {type: 'SET_NODE_PROPS', nodeProps: _np}
}

export function setNodeSelected(nodeId, state) {
    return {type: 'SET_NODE_SELECTED', nodeId: nodeId, state: state}
}

export function toggleNodeSelected(nodeId) {
    return {type: 'TOGGLE_NODE_SELECTED', nodeId: nodeId}
}


/* SELECTORS */

export function getNodeList(state) {
    if (List.isList(state)) {
        return state                // Assume a list of nodes
    } else if (Map.isMap(state)) {
        return state.get('nodes')   // Assume redux state
    } else {                        // Assume redux store
        return state.getState().get('nodes')
    }
}

// Returns the INDEX of the node in the node list
function findNode(state, nodeId) {
    const nodeList = getNodeList(state)
    return nodeList.findIndex((node) => node.get('id') === nodeId)
}

// Returns the NODE with the given ID from the node list
export function getNode(state, nodeId) {
    const nodeList = getNodeList(state)
    return nodeList.find((node) => node.get('id') === nodeId)
}

export function nextNodeId(state) {
    const nodeList = getNodeList(state)
    if (nodeList.size === 0) return 1

    let maxNode = nodeList.max((_a, _b) => {
        const a = _a.get('id'), b = _b.get('id')
        if (a < b) { return -1 }
        if (a > b) { return 1 }
        if (a === b) { return 0 }
    })

    return maxNode.get('id') + 1
}

export function getSelectedNodes(state) {
    const nodeList = getNodeList(state)
    const foundNodes = nodeList.filter((node) => node.get('selected') === true)
    return foundNodes || new List()
}
