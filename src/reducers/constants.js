import {fromJS} from 'immutable';

export const INITIAL_STATE = fromJS({
    game: {
        clientId: 0,
        connection: {
            state: "unknown",
            connected: false
        },
        userId: 0
    },
    nodes: [],
    connections: [],
    attacks: []
});

export const DEFAULT_NODE = fromJS({
    id: 0,
    size: 30,
    health: 0,
    power: 3,
    owner: 0,
    x: 100,
    y: 100,
    color: "#999999"
});
