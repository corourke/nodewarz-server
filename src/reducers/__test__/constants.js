

export const GREEN = 0;
export const BLUE = 1;
export const RED = 2;

export const blue_node = {
    id: 1,
    health: 30,
    size: 30,
    power: 3,
    owner: BLUE,
    x: 100, y:100,
    color: "#3497B5"
}

export const blue_node2 = {
    id: 4,
    health: 60,
    size: 60,
    power: 6,
    owner: BLUE,
    x: 200, y:150,
    color: "#3497B5"
}

export const green_node = {
    id: 2,
    health: 0,
    size: 40,
    power: 4,
    owner: GREEN,
    x: 300, y:100,
    color: "#7BBC9B"
}

export const red_node = {
    id: 3,
    health: 50,
    size: 50,
    power: 5,
    owner: RED,
    x: 400, y:150,
    color: "#A43234"
};

export const red_node2 = {
    id: 5,
    health: 30,
    size: 30,
    power: 3,
    owner: RED,
    x: 500, y:100,
    color: "#A43234"
};

export const network1 = {
    nodes: [blue_node, blue_node2, green_node, red_node],
    connections: []
};

export const network2 = {
    nodes: [blue_node, blue_node2, green_node, red_node, red_node2],
    connections: [ [1,4], [4,2], [2,3], [3,5] ]
};

