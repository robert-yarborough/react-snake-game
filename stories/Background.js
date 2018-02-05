import React from 'react';
const { WIDTH, HEIGHT } = require('../app/js/constants.js');

export default class Background extends React.Component {
    constructor(props) {
        super(props);
        const { height } = props;
        this.state = {
            rows: new Array(height).fill(0)
        }
    }
    render() {
        const rows = this.state.rows;
        const { color, rowHeight } = this.props;
        return (
            <div>
                {rows.map((row, index) => <BackgroundCell {...this.props} index={index} />)}
            </div>
        )
    }
}
export function BackgroundCell({ color = 'blue', index, rowHeight = 50 }) {
    const styles = {
        backgroundColor: color || 'blue',
        width: WIDTH * rowHeight,
        height: rowHeight,
        position: 'absolute',
        left: 0,
        top: rowHeight * index
    };
    return <div style={styles} />;
}