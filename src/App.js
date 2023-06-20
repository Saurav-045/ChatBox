import logo from './logo.svg';
import React from 'react';
import {useRef} from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import {useState} from "react";
import {useCollection, useCollectionData} from 'react-firebase-hooks/firestore';
import { getAuth } from "firebase/auth";
import "firebase/compat/auth" 


firebase.initializeApp({
  apiKey: "AIzaSyCv83ut3Lc-SI_HMocNOlMGbDK0GvrNYfg",
  authDomain: "superchat-f60b2.firebaseapp.com",
  projectId: "superchat-f60b2",
  storageBucket: "superchat-f60b2.appspot.com",
  messagingSenderId: "785011497604",
  appId: "1:785011497604:web:4e98738f72a846b59280d1",
  measurementId: "G-5F8TV4CP60"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        
      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}

function SignOut(){
  return auth.currentUser && (

    <button onCLick={()=> auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('')
  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key = {msg.id} message = {msg} />)}

      <span ref={dummy}></span>
    </main>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button type="submit">Add</button>

    </form>
    </>
  )
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
    );
}
export default App;
