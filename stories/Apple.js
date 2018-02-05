import React from 'react';

export default function Apple({ x, y, height = 50, color = "white" }) {
    const styles = {
        backgroundColor: color,
        width: height,
        height: height,
        position: 'absolute',
        left: x * height,
        top: y * height,
        borderRadius: 50
    };
    return (<div style={styles} />);
}