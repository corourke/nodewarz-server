
// import pf from "pretty-immutable" //TODO: revert to pretty-format when it supports immutable
import {fromJS, Map, List} from "immutable"
import * as C from "./constants"
import {addNode, setNodeProps, getNodeList, getNode, nextNodeId, setNodeSelected, toggleNodeSelected} from "../reducers/nodes"
import {makeStore} from "../store/configureStore"


describe("selectNodeList()", function () {
    let store = makeStore(fromJS({nodes: [C.blue_node, C.red_node2]}))

    it("given redux store should return the list of nodes", function () {
        expect(getNodeList(store)).toEqual(fromJS([C.blue_node, C.red_node2]))
    })
    it("given the redux state should return the list of nodes", function () {
        expect(getNodeList(store.getState())).toEqual(fromJS([C.blue_node, C.red_node2]))
    })
    it("given the node list should return same", function () {
        expect(getNodeList(store.getState().get("nodes"))).toEqual(fromJS([C.blue_node, C.red_node2]))
    })
})

describe("nextNodeId()", function () {
    it("should return 1 when the store is empty", function() {
        let store = makeStore()
        expect(nextNodeId(store)).toEqual(1);
    })
    it("should return the max node ID plus one", function () {
        let store = makeStore(fromJS({nodes: [C.blue_node, C.red_node2]}))
        expect(nextNodeId(store.getState().get("nodes"))).toEqual(C.red_node2.id + 1)
    })
})


describe("nodes reducer", function () {
    let store = makeStore()

    it("should return correct initial state", function () {
        store.dispatch({type: "UNDEFINED", payload: 0})
        expect(store.getState().get("nodes")).toEqual(new List())
    })

    it("should add new nodes", () => {
        store.dispatch(addNode(C.blue_node))
        expect(store.getState().get("nodes").size).toEqual(1)
        store.dispatch(addNode(C.red_node2))
        expect(store.getState().get("nodes").size).toEqual(2)
    })

    it("should set node props", () => {
        const nodeProps = {
            id: 5,
            health: 20,
            owner: C.BLUE
        }
        store.dispatch(setNodeProps(nodeProps))

        let node = getNode(store, nodeProps.id)
        expect(node).toBeDefined()
        Map.isMap(node)
        expect(node.get("owner")).toEqual(C.BLUE)
        expect(node.get("health")).toEqual(20)
        expect(node.get("power")).toEqual(3)
    })

    it("should assign next node IDs", function () {
        store.dispatch(addNode({}))
        expect(getNode(store, 6)).toBeDefined()
    })

    it("should select / deselect a node", function () {
        let node = getNode(store, 6)
        store.dispatch(setNodeSelected(6, true))
        expect(getNode(store, 6).get("selected")).toBeTruthy()
        store.dispatch(setNodeSelected(6, 0))
        expect(getNode(store, 6).get("selected")).toBeFalsy()
    })

    it("should toggle the node select state", function() {
        let node=getNode(store, 5)
        store.dispatch(setNodeSelected(5, false))
        store.dispatch(toggleNodeSelected(5))
        expect(getNode(store, 5).get("selected")).toBeTruthy()
        store.dispatch(toggleNodeSelected(5))
        expect(getNode(store, 5).get("selected")).toBeFalsy()
    })
})

describe("set nodes map", function() {
    it("should replace the nodes map", function() {
        let store = makeStore(fromJS({nodes: [C.blue_node, C.red_node2]}))
        expect(store.getState().get("nodes").size).toEqual(2)
        let nodeMap = fromJS({nodes: [C.blue_node, C.blue_node2, C.green_node, C.red_node2]})
        // store.dispatch(setNodeList)
    })
})