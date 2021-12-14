export const blockSize = 30;
export const boardSize = { x: 10, y: 20 };
export const gameSize = {
    width: boardSize.x * blockSize,
    height: boardSize.y * blockSize,
};

export const canvasSize = {
    width: blockSize * 10,
    height: blockSize * 20
};

export const scoreSys = [40, 100, 300, 1200];
export const speedPerLevel = {
    0: 48,
    1: 43,
    2: 38,
    3: 33,
    4: 28,
    5: 23,
    6: 18,
    7: 13,
    8: 8,
    9: 6,
    10: 5,
    13: 4,
    18: 3,
    19: 2,
    29: 1,
}
export const linesPerLevel = {
    1: 1,
    2: 2,
    3: 3,
    5: 4,
    10: 5,
    15: 6,
    20: 7,
    25: 8,
    30: 9,
    35: 10,
    40: 11,
    45: 12,
    50: 13,
    60: 14,
    70: 15,
    80: 16,
    90: 17,
    100: 18,
    110: 19,
    120: 20,
    130: 21,
    140: 22,
    150: 23,
    160: 24,
    170: 25,
    180: 26,
    190: 27,
    200: 28,
    290: 29,
}

export const colors = [
    ['#000'],
    ['#ee9ca7', '#ee9ca7'],
    ['#42275a', '#734b6d'],
    ['#bdc3c7', '#2c3e50'],
    ['#de6262', '#ffb88c'],
    ['#06beb6', '#48b1bf'],
    ['#eb3349', '#f45c43'],
    ['#dd5e89', '#f7bb97']
];

export const matrixes = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    [
        [0, 0, 0, 0],
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [3, 3],
        [3, 3],
    ],
    [
        [4, 0, 0],
        [4, 4, 4],
        [0, 0, 0],
    ],
    [
        [0, 0, 0],
        [5, 5, 5],
        [0, 0, 5],
    ],
    [
        [6, 6, 0],
        [0, 6, 6],
        [0, 0, 0],
    ],
    [
        [0, 7, 7],
        [7, 7, 0],
        [0, 0, 0],
    ]
];
