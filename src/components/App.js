import React, { useState } from 'react';
import demigod from '../data/demigod-adventure.json';
import Modal from 'react-modal';
import firebase from 'firebase/app';
import 'firebase/database';

import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { LoginModal } from './LoginModal';

Modal.setAppElement("#root");

const App = () => {
    const [data, setData] = useState(demigod);
    const [user, setUser] = useState(null);
    const [phase, setPhase] = useState(0);
    const [helpModal, setHelpModal] = useState(false);
    const [loginModal, setLoginModal] = useState(true);

    let root = document.getElementById("root");
    root.style.backgroundImage = "url('" + data.backgroundImage + "')";

    return (
        <div id="app" className="container">
            <Modal
                overlayClassName="overlay-modal"
                className="login-modal"
                shouldCloseOnOverlayClick={false}
                isOpen={loginModal}
                onRequestClose={() => { setLoginModal(false) }}
                contentLabel="Login Modal" 
            >
                <LoginModal open={setLoginModal} setUser={setUser} setPhase={setPhase} setData={setData}
                data={data} />
            </Modal>
            <Modal
                overlayClassName="overlay-modal"
                className="login-modal"
                isOpen={helpModal}
                onRequestClose={() => { setHelpModal(false) }}
                contentLabel="Login Modal"
            >
                <HelpModal open={setHelpModal} content={data.content[phase]} />
            </Modal>
            <Header name={data.name} bgColor={data.backgroundColor} />
            {user ? <MainContent 
                dataType={data.id} 
                color={data.color} 
                content={data.content} 
                helpModal={setHelpModal} 
                phase={phase} 
                setPhase={setPhase} 
                user={user} 
                setUser={setUser} /> : <div id="loading">&nbsp;</div>}
        </div>
    );
}

export default App;

const HelpModal = (props) => {
    if (props.content.type !== "code") {
        return null;
    }

    const characterImg = {
        backgroundImage: "url(\"" + props.content.incorrect.img + "\")"
    }
    return <>
        <div className="conversation-container">
            <div className="character-img" style={characterImg}>&nbsp;</div>
            <div className="convo">
                <h2>{props.content.incorrect.speaker}:</h2>
                <p>{props.content.incorrect.text}</p>
            </div>
        </div>
    </>
}



const MainContent = (props) => {
    const [solved, setSolved] = useState(false);
    const progress = (props.phase + 1) / props.content.length * 100;

    return (
        <main>
            <ProgressBar percent={progress} color={props.color} />
            <AdventureContainer 
                content={props.content[props.phase]} 
                helpModal={props.helpModal}
                user={props.user}
                phase={props.phase}
                solved={solved}
                setSolved={setSolved}
                setUser={props.setUser}
                color={props.color}
                dataType={props.dataType}
            />
            <Controls 
                changeFunc={props.setPhase}
                phase={props.phase}
                phaseEnd={props.content.length - 1}
                user={props.user}
                solved={solved}
                setSolved={setSolved}
                contentType={props.content[props.phase].type}
                color={props.color}
            />
        </main>
    );
}

const Controls = (props) => {

    const backDisabled = props.phase === 0;
    const backFunc = () => {
        if (!backDisabled) {
            props.changeFunc(props.phase - 1);
        }
    }

    const nextDisabled = props.phaseEnd === props.phase;
    const nextFunc = () => {
        if (!nextDisabled) {
            props.changeFunc(props.phase + 1);
            props.setSolved(false);
        }
    }

    let style = {
        backgroundColor: props.color
    }

    return (
        <section id="control">
            <button 
                style={style}
                className={"btn " + (backDisabled ? "invisible" : "")} 
                onClick={backFunc}>Back</button>
            <p className="small">Current Developer: {props.user.id}</p>
            <button 
                style={style}
                className={"btn " + (nextDisabled ? "invisible" : "")} 
                onClick={nextFunc}
                disabled={props.contentType === "code" && !props.solved}
            >Next</button>
        </section>
    );
}

const AdventureContainer = (props) => {
    let content;
    if (props.content.type === "conversation") {

        const characterImg = {
            backgroundImage: "url(\"" + props.content.img + "\")"
        }

        content = (
            <div className="conversation-container">
                <div className="character-img" style={characterImg}>&nbsp;</div>
                <div className="convo">
                    <h2>{props.content.speaker}:</h2>
                    <p>{props.content.text}</p>
                </div>
            </div>
        );
    }
    else if (props.content.type === "video") {
        content = (
            <div className="flex-center">
                <iframe title={props.content.id}
                    allowFullScreen="allowFullScreen"
                    mozallowfullscreen="mozallowFullScreen" 
                    msallowfullscreen="msallowFullScreen" 
                    oallowfullscreen="oallowFullScreen" 
                    webkitallowfullscreen="webkitallowFullScreen"
                    src={"https://www.youtube.com/embed/" + props.content.url}>
                </iframe>
            </div>
        )
    }
    else if (props.content.type === "image") {
        let style = {
            backgroundImage: ("url('" + props.content.src + "')"),
        }
        content = (
            <div className="flex-center img-container">
                {props.content.description !== "" ? <p>{props.content.description}</p> : null}
                <div className="adventure-img" style={style}>&nbsp;</div>
            </div>
        );
    }
    else if (props.content.type === "code") {
        content = <CodeContainer 
            content={props.content} 
            response={props.response} 
            setReponse={props.setResponse} 
            helpModal={props.helpModal}
            phase={props.phase}
            user={props.user}
            setUser={props.setUser}
            solved={props.solved}
            setSolved={props.setSolved}
            color={props.color}
            dataType={props.dataType} />
    } else if (props.content.type === "end") {
        content = <EndingContainer user={props.user} phase={props.phase} content={props.content} dataType={props.dataType} />;
    }

    return (
        <section className="adventure-content">
            {content}
        </section>
    );
}

const EndingContainer = (props) => {
    const [show, setShow] = useState(false);

    React.useEffect(() => {
        let ref = firebase.database().ref("complete/" + props.dataType + "/" + props.user.id);
        ref.on('value', (snapshot) => {
            let val = snapshot.val();
            if (val) {
                setShow(true);
            }
        });
        return () => { ref.off() };
    }, [props.user.id, props.dataType]);

    const recordCompletion = () => {
        let ref = firebase.database().ref("complete/" + props.dataType + "/" + props.user.id);
        ref.set(true);
        let userIndex = firebase.database().ref("users/" + props.user.id + "/" + props.dataType);
        userIndex.set(props.phase);
    }

    return <div class="end-container">
        <h2>Congratulations on Completing the Coding Adventure!</h2>
        <p>Click the button below so we can record your completion!</p>
        <button onClick={recordCompletion}>Complete Adventure</button>
        <img className={show ? "" : "hidden"} src={props.content.gif} alt="celebration" />
        <p className={show ? "" : "hidden"}>You did it!</p>
    </div>
}

const CodeContainer = (props) => {
    const [response, setResponse] = useState("");

    const submitResponse = () => {
        if (response.toLowerCase() === props.content.answer.toLowerCase()) {
            props.setSolved(true);
            let userIndex = firebase.database().ref("users/" + props.user.id + "/" + props.dataType);
            userIndex.set(props.phase);
        } else {
            props.helpModal(true);
        }
    }

    return <div className="code-container">
                <h2 className="small">It's Coding Time!</h2>
                <p>
                    Complete the following challenge below by navigating to Repl.it and
                    cloning this repo: <span className="bold">{ props.content.repo }</span> <br />
                    Code to find the answer to the question below!
                </p>
                <p>{props.content.question}</p>
                <input 
                    type="text" 
                    placeholder="Type your answer here" 
                    value={response}
                    onChange={(event) => {
                        setResponse(event.target.value);
                    }}
                />
                <button style={{ backgroundColor: props.color }} onClick={submitResponse}>Submit</button>
                <br />
                {props.content.type === "code" && props.user[props.dataType] >= props.phase ?
                <p className="small">
                    Nice you solved this already! <br />Remember the answer is: {props.content.answer.toLowerCase()}
                </p> : null
                }
            </div>;
}