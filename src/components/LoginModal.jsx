import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import minecraft from '../data/minecraft-adventure.json';
import demigod from '../data/demigod-adventure.json';
import animal from '../data/animal-adventure.json';

export const LoginModal = (props) => {
    const [adventure, setAdventure] = useState("demi");
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
                    minecraft: 0,
                    demigod: 0,
                    animal: 0
                }
                user.set(userVal)
            }
            props.setUser(userVal);
            if (adventure === "mine") {
                props.setPhase(userVal.minecraft);
            } else if (adventure === "demi") {
                props.setPhase(userVal.demigod);
            } else if (adventure === "animal") {
                props.setPhase(userVal.animal);
            }
        });
    }

    const changeData = (event) => {
        setAdventure(event.target.value);
        if (event.target.value === "mine") {
            props.setData(minecraft);
        } else if (event.target.value === "demi") { 
            props.setData(demigod);
        } else { // event.target.value === "animal"
            props.setData(animal);
        }
    }

    return <>
        <h1>STEM League Friday Adventure</h1>
        <p>
            Welcome to the web development escape room/coding adventure!
            Open up your Repl.it to complete coding challenges and surpass the challenges
        </p>
        <h2>Select your adventure:</h2>
        <select onChange={changeData} value={adventure}>
            <option value="mine">Minecraft Adventures</option>
            <option value="demi">DemiGod Adventures</option>
            <option value="animal">Animal Crossing Adventures</option>
        </select>
        <input value={props.id} onChange={(event) => { setID(event.target.value) }} 
            type="text" placeholder="Type your Developer ID here" />
        <button className="btn" onClick={login}>Enter</button>
    </>
}