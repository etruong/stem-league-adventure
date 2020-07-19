import React from 'react';

export const Header = (props) => {
    return(
        <header>
            <h1>
                <span className="small">STEM League Web Development Friday Adventures</span><br />
                {props.name}
            </h1>
            <p>
                It's a <span className="bold">Friday Fun Day</span>! Test your web development
                skills in this interactive coding adventure. <br />Make sure to save the confirmation
                code at the end so we know you completed the adventure!
            </p>
        </header>
    );
}