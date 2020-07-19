import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

export const LoginModal = (props) => {
    const [id, setID] = useState("");
    let user = firebase.database().ref("users/" + id);

    React.useEffect(() => {
        return () => {
            user.off();
        }
    }, []);

    const login = async () => {
        props.open(false);
        await user.on('value', (snapshot) => {
            let userVal = snapshot.val();
            if (!userVal) {
                userVal = {
                    id: id,
                    index: 0,
                    passwords: {
                        0: "What is love"
                    }
                }
                user.set(userVal)
            }
            props.setUser(userVal);
            props.setPhase(userVal.index);
        });
    }

    return <>
        <h1>STEM League Friday Adventure</h1>
        <h2>Minecraft Adventure</h2>
        <p>
            Welcome to the very first web development escape room/coding adventure!<br />
            Open up your Repl.it to complete coding challenges and surpass the challenges
        </p>
        <input value={props.id} onChange={(event) => { setID(event.target.value) }} 
            type="text" placeholder="Type your Developer ID here" />
        <button className="btn" onClick={login}>Enter</button>
    </>
}