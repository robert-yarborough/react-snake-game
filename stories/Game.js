const { WIDTH, HEIGHT } = require('../app/js/constants.js');
const { createSnake, move, died, turn, createApple, eating } = require("../app/js/state.js");
const React = require('react');
import Background from "./Background";
import Snake from "./Snake";
import Apple from "./Apple";

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snake: this.props.snake || createSnake(),
            snakeIsDead: false,
            paused: this.props.paused || false,
            apple: this.props.apple || createApple()
        }
    }

    gameLoop(directionToTurn) {
        this.setState((prevState, props) => {
            if (prevState.snakeIsDead) {
                this.stopLoop();
                return prevState;
            }

            const newState = Object.assign({}, prevState);
            const needsToGrow = eating(newState.apple, newState.snake);
            if (directionToTurn) {
                newState.snake = move(turn(directionToTurn, newState.snake), needsToGrow);
            } else {
                newState.snake = move(newState.snake, needsToGrow);
            }
            if (needsToGrow) {
                newState.apple = props.apple || createApple()
            }
            newState.snakeIsDead = died(newState.snake)
            return newState;
        });
    }
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));

        if (this.state.paused) {
            return true;
        }
        this.timerID = setInterval(this.gameLoop.bind(this), 500);
    }
    stopLoop() {
        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
        clearInterval(this.timerID);
    }
    componentWillUnmount() {
        this.stopLoop();
    }
    handleKeyDown(e) {
        this.gameLoop(e.code)
    }
    render() {
        if (!this.state.snakeIsDead) {
            let snake = this.state.snake;
            const styles = {
                width: 1000,
                height: 1000
            }
            let { location: [appleX, appleY] } = this.state.apple;

            return (
                <div style={styles} onKeyDown={this.handleKeyDown}>
                    <Background rowHeight={25} height={HEIGHT} />
                    <Snake snake={snake} height={25} />
                    <Apple height={25} x={appleX} y={appleY} />
                </div>
            );
        } else {
            return (
                <div>
                    <h1> OOPS</h1>
                </div>
            )
        }
    }
}