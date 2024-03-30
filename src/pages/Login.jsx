import React, { useState } from "react";
import { auth, database } from '../firebase';
import '../Login.css';
import { sendEmailVerification, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, onAuthStateChanged } from "firebase/auth";
import { signInWithGooglePopup } from "../firebase";
import { collection, doc, setDoc } from 'firebase/firestore';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [emailError, setEmailError] = useState(null); // Initializare cu null

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setEmailError('Adresa de e-mail introdusă nu este validă!');
            return;
        }

        const auth = getAuth();
        onAuthStateChanged(auth, (user) =>{
          if(user){
            const uid =user.uid;
            localStorage.setItem("userUid",uid);
          }
        }
        )
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                navigate('/home');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const handleSubmitsignup = (e) => {
        e.preventDefault();
        const auth = getAuth();
        
        if (!isValidEmail(email)) {
            setEmailError('Adresa de e-mail introdusă nu este validă!');
            return;
        }

        // Verificare dacă parolele coincid
        if (password !== confirmpassword) {
            alert('Parola și confirmarea parolei nu coincid!');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                //SE MODIFICA USERNAME UL
                const docRef = setDoc(doc(database, "utilizatori", userCredential.user.uid), {
                    nume_utilizator: username,
                    email: email,
                });

                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        console.log("email trimis")
                    });

                updateProfile(auth.currentUser, {
                    displayName: username
                }).then(() => {
                    console.log("update username")
                })

                console.log("creat");
                alert("cont creat")
            })
            .catch((error) => {
                alert('Error!')
            });
    }

    const logGoogleUser = async () => {
        const response = await signInWithGooglePopup();
        navigate('/home');
    }

    // Funcție pentru validarea adresei de e-mail,
    const isValidEmail = (email) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    return (
        <div className="blur-container">
            <div className="area">
                <div className="main">
                    <input type="checkbox" id="chk" aria-hidden="true" />
                    <div className="signup">
                        <form onSubmit={(e) => handleSubmitsignup(e)} action="">
                            <label htmlFor="chk" aria-hidden="true">Inregistrare</label>
                            <input type="text" value={username} name="txt" placeholder="Nume utilizator" required="" onChange={(e) => setUsername(e.target.value)} />
                            <input type="email" value={email} name="email" placeholder="Email" required="" onChange={(e) => setEmail(e.target.value)} />
                            {emailError && <p className="error-message">Adresa de e-mail este invalidă!</p>}
                            <input type="password" value={password} name="pswd" placeholder="Parola" required="" onChange={(e) => setPassword(e.target.value)} />
                            <input type="password" value={confirmpassword} name="pswd" placeholder="Confirmare Parola" required="" onChange={(e) => setConfirmPassword(e.target.value)} />
                            <button>Inregistreaza-te</button>
                            <button onClick={logGoogleUser}>Google</button>
                        </form>
                    </div>
                    <div className="login">
                        <form onSubmit={(e) => handleSubmit(e)} action="">
                            <label htmlFor="chk" aria-hidden="true">Conectare</label>
                            <input type="email" name="email" placeholder="Email" required="" value={email} onChange={(e) => setEmail(e.target.value)} />
                            {emailError && <p className="error-message">Adresa de e-mail este invalidă!</p>}
                            <input type="password" name="pswd" placeholder="Parola" required="" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button>Conecteaza-te</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;
