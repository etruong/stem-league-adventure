import React from 'react';

export const Header = (props) => {

    let style = {
        color: (props.bgColor === "light" ? "black" : "white")
    }

    return(
        <header style={style}>
            <h1>
                <span className="small">STEM League Web Development Friday Adventures</span><br />
                {props.name}
            </h1>
            <p>
                It's a <span className="bold">Friday Fun Day</span>! Test your web development
                skills in this interactive coding adventure.
            </p>
        </header>
    );
}