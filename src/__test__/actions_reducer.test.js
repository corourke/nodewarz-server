import {Map, List, fromJS} from 'immutable';
import * as C from "./constants"
import {makeStore} from "../store/configureStore"
import {getNode} from "../reducers/nodes"
import {resetAttacks, newAttack, removeAttacks, getAttacks, attackInProgress, nodesUnderAttack, applyAttackCycle} from "../reducers/attacks.js"
import pf from "pretty-immutable"

describe("attacks reducer", () => {
    const store = makeStore(fromJS({nodes: [C.blue_node, C.red_node2]}))

    describe("newAttack", () => {
        it("newAttack should add a new attack", function () {
            store.dispatch(resetAttacks());
            if (!attackInProgress(store, C.blue_node.id, C.green_node.id)) {
                store.dispatch(newAttack(C.blue_node.id, C.green_node.id))
            }
            if (!attackInProgress(store, C.red_node.id, C.green_node.id)) {
                store.dispatch(newAttack(C.red_node.id, C.green_node.id))
            }
            expect(getAttacks(store)).toEqual(
                fromJS([
                    {attackNodeId: C.blue_node.id, targetNodeId: C.green_node.id},
                    {attackNodeId: C.red_node.id, targetNodeId: C.green_node.id}
                ])
            )
        })
        it("should work with just numbers", function () {
            store.dispatch(resetAttacks());
            store.dispatch(newAttack(1, 2));
            store.dispatch(newAttack(3, 2));
            expect(getAttacks(store)).toEqual(
                fromJS([
                    {attackNodeId: 1, targetNodeId: 2},
                    {attackNodeId: 3, targetNodeId: 2}
                ])
            )
        })
    })
    describe('removeAttacks', function () {
        it("should remove all attacks for a given node", function () {
            store.dispatch(resetAttacks());
            store.dispatch(newAttack(1, 2));
            store.dispatch(newAttack(3, 4));

            store.dispatch(removeAttacks(2));
            expect(getAttacks(store)).toEqual(
                fromJS([{attackNodeId: 3, targetNodeId: 4}])
            );

        });
        it("should not remove attacks if node not in the list", function () {
            store.dispatch(newAttack(1, 2));
            store.dispatch(removeAttacks(5));
            expect(getAttacks(store)).toEqual(
                fromJS([
                    {attackNodeId: 3, targetNodeId: 4},
                    {attackNodeId: 1, targetNodeId: 2}
                ])
            );
        })
    })
    describe('resetAttacks', function () {
        it("should empty the attacks list", function () {
            store.dispatch(resetAttacks());
            expect(getAttacks(store).size).toEqual(0);
        })
    })
})

describe('Test selectors', () => {
    describe('attackInProgress()', function () {
        const store = makeStore(C.network2);

        store.dispatch(resetAttacks());
        store.dispatch(newAttack(4, 2));
        store.dispatch(newAttack(3, 2));
        it("should return true if attack and target nodes are in the attack list", function () {
            expect(attackInProgress(store, 4, 2)).toEqual(true);
        });
        it("should return false if attack and target nodes are not in the attack list", function () {
            expect(attackInProgress(store, 2, 4)).toEqual(false);
        })
    });

    describe('getNode()', function() {
        const store = makeStore(C.network2);
        it('should return the correct node given the nodeId value', function() {
            expect(getNode(store, 2)).toEqual(fromJS(C.green_node))
        })
    })

    describe('nodesUnderAttack()', function () {
        const store = makeStore(C.network2);

        store.dispatch(resetAttacks());
        store.dispatch(newAttack(4, 2));
        store.dispatch(newAttack(3, 2));


        it("should return an array of nodes being attacked", function () {
            expect(nodesUnderAttack(store)).toEqual(fromJS([2]));
        });

        it("should return two nodes if two nodes are under attack", function () {
            store.dispatch(newAttack(1,3));
            expect(nodesUnderAttack(store)).toEqual(fromJS([2,3]));
        })
    });
});

describe('Applying one attack cycle', function () {
    const store = makeStore(C.network2);

    store.dispatch(resetAttacks());
    store.dispatch(newAttack(C.blue_node2.id, C.green_node.id));
    store.dispatch(newAttack(C.red_node.id, C.green_node.id));

    it("should correctly adjust the node health based on the attack values", () => {
        const newHealth = Math.abs(Math.abs(C.green_node.health - C.red_node.power) - C.blue_node2.power)
        const healthAtFull = applyAttackCycle(store, C.green_node.id)
        expect(healthAtFull).toEqual(false);
        expect(getNode(store, C.green_node.id).get('health')).toEqual(newHealth);
    })

    it("should return false when the health is less than full", () => {
        expect(applyAttackCycle(store, C.green_node.id)).toEqual(false);
    })

    it("should return true when health is full", () => {
        while(!applyAttackCycle(store, C.green_node.id)) {
            expect(getNode(store, 2).get('health')).toBeLessThan(C.green_node.size);
        }
    })

    it("should leave the node with the correct owner and make no other changes", () => {
        expect(getNode(store, C.green_node.id).get('owner'))
            .toEqual((C.red_node.power-C.blue_node2.power) > 0 ? C.RED : C.BLUE);
        expect(getNode(store, C.green_node.id).get('power')).toEqual(C.green_node.power);
    })
})


describe('Cycling multiple attacks until no more attacks', function () {
    const store = makeStore(C.network2);

    store.dispatch(resetAttacks());
    store.dispatch(newAttack(C.blue_node2.id, C.green_node.id));
    store.dispatch(newAttack(C.red_node.id, C.green_node.id));
    store.dispatch(newAttack(C.red_node.id, C.blue_node.id));

    while(nodesUnderAttack(store).size != 0) {  // onFrame
        nodesUnderAttack(store).forEach((targetNodeId) => {
            if (applyAttackCycle(store, targetNodeId)) {
                store.dispatch(removeAttacks(targetNodeId))
            }
        })
    }

    it("should remove all attacks", function () {
        expect(nodesUnderAttack(store).size).toEqual(0)
    })
})


