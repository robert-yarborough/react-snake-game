const HEIGHT = 20;
const WIDTH = 20;
const TYPES = {
    SNAKE: "SNAKE",
    APPLE: "APPLE"
}
const DEFAULT_SPEED = 1;

const DIRECTIONS = {
    "ArrowUp": [0, -1],
    "ArrowRight": [1, 0],
    "ArrowDown": [0, 1],
    "ArrowLeft": [-1, 0],
}
module.exports = {
    HEIGHT, WIDTH, DIRECTIONS, TYPES, DEFAULT_SPEED
}