import React from 'react';
import { shallow } from 'enzyme';
import Game from '../stories/Game';
import { move, kill, createSnake, turnUp } from "../app/js/state";

describe("Game", () => {
    let game;
    beforeEach(() => {
        game = shallow(<Game />)
    })
    it("has a snake in the beginnig", () => {
        expect(game.state("snake")).toBeDefined();
        expect(game.state("snakeIsDead")).toBe(false);
    })
    describe("gameLoop", () => {
        let playGame = (game) => game.instance().gameLoop()

        it("moves the snake on game loop", () => {
            const snakeBeforeGameLoop = game.state("snake");

            playGame(game);

            expect(game.state("snake")).toEqual(move(snakeBeforeGameLoop))
        })
        it("indicates if snake died", () => {
            const snake = game.state("snake");
            game.setState({ snake: kill(snake) });

            playGame(game);

            expect(game.state("snakeIsDead")).toBeTruthy();
        })
        it("indicates if snake is about to die", () => {
            const snake = game.state("snake");
            let snakeInTheCorner = createSnake([[0, 0], [0, 1]]);
            game.setState({ snake: turnUp(snakeInTheCorner) });

            playGame(game);

            expect(game.state("snakeIsDead")).toBeTruthy();
        })
        it("keep snake alive", () => {
            const snake = game.state("snake");

            playGame(game);

            expect(game.state("snakeIsDead")).toEqual(false);
        })
        it("grows if we hit the apple", () => {
            const snake = game.state("snake");
            let lengthOfSnakeBefore = game.state("snake").body.length;

            game.setState({ apple: { location: snake.body[0] } })
            playGame(game)

            expect(game.state("snake").body.length).not.toEqual(lengthOfSnakeBefore);
        })
        it("changes the apple location when apple is hit", () => {
            game.setState({ apple: { location: game.state("snake").body[0] } })
            const appleBefore = game.state("apple");

            playGame(game)

            expect(game.state("apple").location).not.toEqual(appleBefore.location)
        })
        it("does nothing when snakeIsDead", () => {
            game.setState({ snake: createSnake([[-1, -1]]) });
            playGame(game);
            const deathState = game.state("snake");

            playGame(game)

            expect(game.state("snake")).toEqual(deathState);
        })
    })
    describe("handleKeyDown", () => {
        it("turnes the snake if arrow is preset", () => {
            const snakeBeforeTurn = game.state('snake');
            game.instance().handleKeyDown({ code: 'ArrowUp' });

            expect(snakeBeforeTurn.direction).not.toEqual(game.state('snake').direction);
        })
        it("grows on turn", () => {
            const snake = game.state("snake");
            let lengthOfSnakeBefore = game.state("snake").body.length;

            game.setState({ apple: { location: snake.body[0] } })

            game.instance().handleKeyDown({ code: 'ArrowUp' });

            expect(game.state("snake").body.length).not.toEqual(lengthOfSnakeBefore);
        })
    })
})