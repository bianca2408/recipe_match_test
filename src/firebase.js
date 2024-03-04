// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import {getAuth , createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {getStorage, ref, uploadBytes} from 'firebase/storage';
import { getDatabase } from "firebase/database";
import { useEffect, useState } from "react";






// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCigywXyJx2siKj584XECYAfatYnvcNC1Y",
  authDomain: "recipematch-5bb73.firebaseapp.com",
  projectId: "recipematch-5bb73",
  storageBucket: "recipematch-5bb73.appspot.com",
  messagingSenderId: "839692409483",
  appId: "1:839692409483:web:99669049298e6f2b7c928e",
  measurementId: "G-3HPRJ0GJBX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const storage=getStorage(app);
export const database =getFirestore(app);
export const auth = getAuth(app);

// GOOGLE AUTHENTIFICATION
const provider = new GoogleAuthProvider();
  
// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({   
    prompt : "select_account "
});
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);



//storage
export async function upload(file,user,setLoading){
  const fileRef=ref(storage, user.uid + '.png')
  setLoading(true)
  const snapshot = await uploadBytes(fileRef,file);
  setLoading(false)
  alert("uploaded file")
}





export default app