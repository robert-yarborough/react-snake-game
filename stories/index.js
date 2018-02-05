import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Background from "./Background"
import Snake from "./Snake"
import Game from "./Game"
import Apple from "./Apple"
import { createSnake, move, kill } from "../app/js/state";

storiesOf("Background", module)
  .add('with no height', () => (
    <Background />
  ))
  .add('with 50 rows', () => (
    <Background height={50} />
  ))
  .add('with different color', () => (
    <Background color="red" />
  ))
  .add('with custom height of row', () => (
    <Background rowHeight={10} />
  ))

storiesOf("Snake", module)
  .add("snake with default length", () => (
    <Snake />
  ))
  .add("snake with custom height", () => (
    <Snake height={10} />
  ))
  .add("snake with custom color", () => (
    <Snake color="blue" />
  ))
  .add("snake moving", () => (
    <SnakeMover />
  ));
storiesOf("Game", module)
  .add("game paused", () => (
    <Game paused={true} />
  ))
  .add("game going", () => (
    <Game paused={false} />
  ))
  .add("game is over", () => (
    <Game snake={kill(createSnake())} />
  ))
  .add("game is almost over", () => (
    <Game snake={createSnake([[19, 0], [18, 0]])} paused={false} />
  ));
storiesOf("Apple", module)
  .add("apple is somewhere random", () => (
    <Apple color="red" />
  ))

class SnakeMover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snake: createSnake()
    }
  }
  componentDidMount() {
    this.timerID = setInterval(
      () => this.setState({ snake: move(this.state.snake) }),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  render() {
    return <Snake snake={this.state.snake} />
  }
}