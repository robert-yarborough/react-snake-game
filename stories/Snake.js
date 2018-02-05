import React from 'react';
import { move, createSnake } from "../app/js/state"

export default class Snake extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let snake = this.props.snake || createSnake();
        let { body: [[headX, headY], ...body] } = snake;
        return (
            < div >
                <Head x={headX} y={headY} {...this.props} />
                {body.map(([x, y]) => <SnakeBodyPart x={x} y={y} {...this.props} />)}
            </div >
        );
    }
}
function Head(props) {
    const { x, y } = props;
    return <SnakeBodyPart x={x} y={y} {...props} color="red" />
}
function SnakeBodyPart({ x, y, height = 50, color = "lime" }) {
    const styles = {
        backgroundColor: color,
        width: height,
        height: height,
        borderRadius: 5,
        position: 'absolute',
        left: x * height,
        top: y * height
    };
    return <div style={styles} />;
}