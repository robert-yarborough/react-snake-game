const { rand, pipe, compareVectors } = require('./helpers')
const { TYPES, DIRECTIONS, HEIGHT, WIDTH, DEFAULT_SPEED } = require("./constants");

export const turnDown = (snake) => turn("ArrowDown", snake);
export const turnLeft = (snake) => turn("ArrowLeft", snake);
export const turnUp = (snake) => turn("ArrowUp", snake);
export const turnRight = (snake) => turn("ArrowRight", snake);

class GameState {
    constructor() {
        this.snake = new Snake();
    }
}

export function createSnake(body = [[4, 0], [3, 0], [3, 1], [3, 2]]) {
    return {
        // the first element is head
        body: body,
        direction: DIRECTIONS['ArrowRight'],
        type: TYPES.SNAKE,
        speed: DEFAULT_SPEED
    }
}

export function createApple() {
    return {
        location: [rand(0, WIDTH), rand(0, HEIGHT)],
        type: TYPES.APPLE
    }
}

const getSpeed = (snake) => snake.speed || DEFAULT_SPEED

export function move(snake, growing, speedAchieved = 0) {
    let speed = getSpeed(snake);
    // We only eat when we are not moving
    snake = shiftBody(snake, growing);
    speedAchieved += 1;
    if (speed > speedAchieved) {
        snake = move(snake, false, speedAchieved);
    }
    return snake;
}
function shiftBody(snake, growing) {
    let { body, direction } = snake;
    let [headX, headY] = body[0];
    let [dirX, dirY] = direction;
    let newHead = [[headX + dirX, headY + dirY]]
    let newBody = growing ? body.slice(0) : body.slice(0, -1);

    return Object.assign({}, snake, { body: newHead.concat(newBody) });
}
export const oppositeDirection = (dir) => dir.map((x) => x === 0 ? 0 : -x);

function isTurnAllowed(currentDirection, newDirection) {
    const oppositeDirection = currentDirection.map((x) => x === 0 ? 0 : -x);
    return !compareVectors(oppositeDirection, newDirection)
}
export function turn(keyboardCode, snake) {
    let newDirection = DIRECTIONS[keyboardCode];
    if (newDirection !== undefined && isTurnAllowed(snake.direction, newDirection)) {
        return Object.assign({}, snake, { direction: newDirection })
    } else {
        return snake;
    }
}

export function headOverlappingWithBody({ body: [[headX, headY], ...body] }) {
    return body.some(([bodyX, bodyY]) => headX === bodyX && headY === bodyY);
}

export function increaseSpeed(step, snake) {
    return Object.assign({}, snake, { speed: snake.speed + step });
}

export const increaseSpeedByStep = (snake) => increaseSpeed(DEFAULT_SPEED, snake);
const log = (value) => { console.log(value); return value; }

export function headOutsideBoundaries({ body: [[headX, headY]] }) {
    return headX >= WIDTH || headY >= HEIGHT || headX < 0 || headY < 0;
}

export function died(snake) {
    return headOverlappingWithBody(snake) || headOutsideBoundaries(snake);
}

export function eating({ location: [appleX, appleY] }, { body: [[headX, headY]] }) {
    return appleX === headX && appleY === headY;
}

export function kill(snake) {
    return Object.assign({}, snake, { body: [[-1, -1]] });
}

// snake.move().move().turnLeft().turnRight().turnUp().died()
// snake.move().move().turnRight().turnUp().died()
// died(move(turn('ArrowDown', turn('ArrowLeft', move(move(turn('ArrowUp', move(move(turn('ArrowRight', move(move(snake2))))))))))))

/* to play in console:
let {pipe} = require("./app/js/helpers")
let {createSnake, move, turnLeft, turnRight, turnUp, turnDown, died } = require('./app/js/state')
let snake = createSnake();
pipe(move, move, turnUp, move, turnLeft, turnDown, move, died)(snake)
*/