import React from 'react';

export const ProgressBar = (props) => {
    const style = {
        backgroundColor: props.color,
        width: props.percent + "%"
    }

    return (
        <div className="prog-bar"><div style={style}>&nbsp;</div></div>
    );
}