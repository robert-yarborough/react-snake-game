const {
    createSnake,
    move,
    turn,
    headOverlappingWithBody,
    headOutsideBoundaries,
    died,
    turnLeft,
    turnRight,
    turnDown,
    turnUp,
    increaseSpeed,
    increaseSpeedByStep,
    eating,
    oppositeDirection,
    createApple
} = require("../app/js/state");
const { TYPES, DIRECTIONS, HEIGHT, WIDTH } = require("../app/js/constants");

const { pipe } = require("../app/js/helpers");
const log = (snake) => { console.log(snake.body); return snake; }
// DSL - Domain Specific Language

function Snake() {
    return {
        looking: function (direction) {
            const keyboardDirection = 'Arrow' + direction[0].toUpperCase().concat(direction.slice(1));
            this.__direction = DIRECTIONS[keyboardDirection]
            return this;
        },
        withHeadAt: function (headX, headY) {
            this.__body = [[headX, headY]];
            return this;
        },
        ofLength: function (length) {
            this.__length = length;
            return this;
        },
        withSpeed: function (speed) {
            this.__speed = speed;
            return this;
        },
        append: function (x, y) {
            this.__body.push([x, y])
            return this;
        },
        build: function () {
            if (this.__direction === undefined) {
                this.__direction = DIRECTIONS['ArrowRight'];
            }
            const [growthDirectionX, growthDirectionY] = oppositeDirection(this.__direction)
            for (let i = 0; i < this.__length; i++) {
                const [lastBodyX, lastBodyY] = this.__body[i];
                this.__body.push([lastBodyX + growthDirectionX, lastBodyY + growthDirectionY])
            }
            return { body: this.__body, direction: this.__direction, speed: this.__speed }
        }
    }
}

describe("Initial Game State", () => {
    describe("createSnake", () => {
        test("has been initialised", () => {
            const snake = createSnake();
            expect(snake.body).toHaveLength(4);
            expect(snake.direction).toHaveLength(2);
            expect(snake.type).toBeDefined();
            expect(snake.speed).toBeDefined();
        })
    });
    function compareSnakeBodies(actualSnake, expectedSnake) {
        expect(actualSnake.body).toEqual(expectedSnake.body);
    }
    describe("move", () => {
        test("it moves the body to one coordinate", () => {
            const originalSnake = new Snake().withHeadAt(3, 0).ofLength(2).build();
            const snake = move(originalSnake);

            compareSnakeBodies(snake, new Snake().withHeadAt(4, 0).ofLength(2).build());
            expect(snake.body).not.toEqual(originalSnake.body);
        })
        test("it moves the body to a coordinate defined by speed", () => {
            const originalSnake = new Snake().withHeadAt(3, 0).ofLength(2).withSpeed(2).build();
            const snake = move(originalSnake);

            compareSnakeBodies(snake, new Snake().withHeadAt(5, 0).ofLength(2).build())
            const snakeWithSpeedOf3 = move(increaseSpeedByStep(snake));
            compareSnakeBodies(snakeWithSpeedOf3, new Snake().withHeadAt(8, 0).ofLength(2).build())
        })
        test("it grows when grow is passed", () => {
            const originalSnake = new Snake().withHeadAt(3, 0).ofLength(2).build();
            const snake = move(originalSnake, true);

            compareSnakeBodies(snake, new Snake().withHeadAt(4, 0).ofLength(3).build())
        })
        test("it grows when grow is passed with respect to speed", () => {
            const originalSnake = new Snake().withHeadAt(3, 0).ofLength(3).withSpeed(2).build();
            const snake = move(originalSnake, true);

            compareSnakeBodies(snake, new Snake().withHeadAt(5, 0).ofLength(4).build())
        })
    })

    describe("turn", () => {
        test("it changes the direction if valid direction is passed", () => {
            const originalSnake = new Snake().looking("left").build();
            const snake = turnUp(originalSnake);

            expect(snake.direction).not.toEqual(originalSnake.direction);
        })
        test("it doesn not change direction if invalid direction is passed", () => {
            const originalSnake = new Snake().looking("left").build();
            const snake = turn('Fdjkfjdkjfdkjfd', originalSnake);

            expect(snake.direction).toEqual(originalSnake.direction);
        })
        test("it does not turn if we are trying to turn down when facing up", () => {
            const originalSnake = new Snake().looking("up").build();
            const snake = turnDown(originalSnake);

            expect(snake.direction).toEqual(originalSnake.direction);
        })
        test("it does not turn if we are trying to turn left when facing right", () => {
            const originalSnake = new Snake().looking("right").build();
            const snake = turnLeft(originalSnake);

            expect(snake.direction).toEqual(originalSnake.direction);
        })
    })

    describe("headOverlappingWithBody", () => {
        test("does not overlap for the new snake", () => {
            const snake = createSnake();

            expect(headOverlappingWithBody(snake)).toBeFalsy();
        })
        test("does overlap when head is inside the body", () => {
            const originalSnake = createSnake();
            const snake = pipe(turnDown, turnLeft, move)(originalSnake)

            expect(headOverlappingWithBody(snake)).toBeTruthy();
        })
    })
    describe("headOutsideBoundaries", () => {
        test("new snake is inside the bounds", () => {

            expect(pipe(createSnake, headOutsideBoundaries)()).toBeFalsy();
        })
        test("is outside the bounds when exceeding the width", () => {
            const snake = new Snake().withHeadAt(WIDTH + 1, 0).build();

            expect(headOutsideBoundaries(snake)).toBeTruthy();
        })
        test("is outside the bound when exceeding the height", () => {
            const snake = new Snake().withHeadAt(0, HEIGHT + 1).build();

            expect(headOutsideBoundaries(snake)).toBeTruthy();
        })
        test("outside the bounds when head has negative coordinates", () => {
            const snake = new Snake().withHeadAt(-1, -1).build();

            expect(headOutsideBoundaries(snake)).toBeTruthy();
        })
        test("is outside when on the boundary", () => {
            const snake = new Snake().withHeadAt(HEIGHT, WIDTH).build();

            expect(headOutsideBoundaries(snake)).toBeTruthy();
        })
    })
    describe("died", () => {
        it("thinks that zombies are dead", () => {
            let zombieSnakes = [
                new Snake().withHeadAt(-1, -1).build(),
                new Snake().withHeadAt(HEIGHT + 1, WIDTH + 1).build(),
                new Snake().withHeadAt(15, 0).append(15, 0).build()
            ];
            zombieSnakes.forEach((snake) => expect(died(snake)).toBeTruthy());
        })
    })

    describe("increaseSpeedX", () => {
        test("it increases the speed of the snake by 1, by default", () => {
            const originalSnake = new Snake().withSpeed(1).build();

            let snake = increaseSpeedByStep(originalSnake);

            expect(snake.speed).toBe(2);
        })
        test("it increases the speed of the snake by any value", () => {
            const originalSnake = new Snake().withSpeed(1).build();

            let snake = increaseSpeed(10, originalSnake);

            expect(snake.speed).toBe(11);
        })
        describe("createApple", () => {
            test("it initialises apple", () => {
                const apple = createApple();

                expect(apple.location).toHaveLength(2);
                expect(apple.type).toBeDefined();
            })
        })

        describe("eating", () => {
            it("does not eat the apple by default", () => {
                let snake = createSnake();
                let apple = createApple();

                expect(eating(apple, snake)).toBeFalsy();
            })
            it("eats an apple with its head", () => {
                let snake = createSnake();
                let apple = { location: snake.body[0] }

                expect(eating(apple, snake)).toBeTruthy();
            })
        })
    })

})