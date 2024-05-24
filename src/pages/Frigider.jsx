import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'boxicons';
import '../index.css';
import '../index.js';
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase.js";
import { storage } from "../firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase.js";
import { database } from "../firebase.js";
import { getDoc, collection, getDocs, doc, updateDoc, arrayRemove } from "firebase/firestore"
import Modal from "../components/Modal.js";
import Login from "./Login.jsx";
import '../Stilizare/frigider.css';
export default function Home() {
  const user = auth.currentUser;
  const inputFileRef = useRef();
  const navigate = useNavigate();

  const handleLogOut = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log("Te-ai deconectat");
      localStorage.removeItem("userUid");
      navigate('/');
    }).catch((error) => {
      console.error("Eroare la deconectare:", error);
    });
  };

  useEffect(() => {
    const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
  });

  searchBtn.addEventListener("click", () => {
    sidebar.classList.remove("close");
  });

  modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
      modeText.innerText = "Luminos";
    } else {
      modeText.innerText = "Intunecat";
    }
  });

  // Cleanup (remove the event listeners) when the component unmounts
  return () => {
    toggle.removeEventListener("click", () => {
      sidebar.classList.toggle("close");
    });

    searchBtn.removeEventListener("click", () => {
      sidebar.classList.remove("close");
    });

    modeSwitch.removeEventListener("click", () => {
      body.classList.toggle("dark");
      if (body.classList.contains("dark")) {
        modeText.innerText = "Luminos";
      } else {
        modeText.innerText = "Intunecat";
      }
    });
  };
}, []); 
 



  return (
    <div>
      {!user &&
        <Login />
      }
      <body>
        <nav className="sidebar close">
        <header>
                <div className="image-text">
                    <span className="image">
                    <Link to='/home'>  <img src={logo} alt="logo" /></Link>
                    </span>
                    <div class="text header-text">
                        <span className="name">RecipeMatch</span>

                    </div>
                </div>
                <box-icon name='chevron-right' class="chevron-right toggle"></box-icon>
            </header>
            <div className="menu-bar">
                <div className="menu">
                <li className="search-box">
                            
                                <box-icon name='search' class="icon"></box-icon>
                                <input type="text" placeholder="Caută..."/> 
                            
                        </li>
                    <ul className="menu-links">
                        <li className="nav-link">
                        <Link to='/profile'>
                                <box-icon name='food-menu' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Rețetele mele
                                </span>
                            </Link>
                        </li>
                        <li className="nav-link">
                        <Link to='/chat'>
                                <box-icon name='chat' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Grupuri
                                </span>
                            </Link>
                        </li>
                        <li className="nav-link">
                        <Link to='/favorite'>
                        <box-icon name='star' class='icon'></box-icon>
                                <span className="text nav-text">
                                    Favorite
                                </span>
                            </Link>
                        </li>
                        <li className="nav-link">
                        <Link to='/frigider'>
                                <box-icon name='fridge' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Frigider
                                </span>
                            </Link>
                        </li>
                        <li className="nav-link">
                        <Link to='/setari'>
                                <box-icon name='cog' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Setări
                                </span>
                            </Link>
                        </li>
                    </ul>
                    </div>
                    <div className="bottom-content">
                    <li className="">
                    <Link to='/profile'>
                            <box-icon onClick={handleLogOut} name='log-out' class="icon"></box-icon>
                                <span onClick={handleLogOut} className="text nav-text">
                                    Deconectare
                                </span>
                            </Link>
                        </li>
                        <li className="mode">
                            
                           <div className="moon-sun">
                           <box-icon type='solid' name='moon' class="i moon"></box-icon>
                           <box-icon type='solid' name='sun' class="i sun"></box-icon>
                           </div>
                            <span className="mode-text text">Întunecat</span>    
                           <div className="toggle-switch">
                            <span className="switch"></span>
                           </div>
                        </li>
                    </div>
                
            </div>
        </nav>
        <div className="main--content">
          <div className="header--wrapper">
          
          <h2 style={{ textAlign: 'center', fontFamily: "Poppins, sans-serif", fontSize: '2rem', color: '#fff', marginTop: '20px', borderBottom: '2px solid lightgray' }}>Frigider</h2>

      
          </div>
        </div>
        
      </body>
    </div>
  );
}
