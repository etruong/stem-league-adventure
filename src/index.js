import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './components/App';
import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDWOxuPtSMsLKQvEQGO_j5i7JOZ68Rilh8",
  authDomain: "test-a3d7a.firebaseapp.com",
  databaseURL: "https://test-a3d7a.firebaseio.com",
  projectId: "test-a3d7a",
  storageBucket: "test-a3d7a.appspot.com",
  messagingSenderId: "244196474262",
  appId: "1:244196474262:web:93af96d90d1a4a540f71b7",
  measurementId: "G-K13VL9JC97"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
