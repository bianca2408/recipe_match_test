
import React , {useEffect, useState, Component} from "react";


import {Link, useNavigate} from "react-router-dom";

import '../index.css';
import '../index.js';

import Button from '../components/Button';
import Card from '../components/Card'
import Test from './test'


import logo from '../assets/logo.png';
import profile from '../assets/profile.png';
import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";

import Cards from './Cards.jsx'

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { database } from "../firebase.js";
import { collection, doc, getDocs } from 'firebase/firestore';

async function fetchDataFromFirestore(){
const querySnapshot = await getDocs(collection(database, "retete_utilizator"));
const data =[];
querySnapshot.forEach((doc) => {
  
  data.push({id: doc.id, ...doc.data()})
});
return data;
}

    




export default function Home(){

    const navigate = useNavigate();
    const user = auth.currentUser;
    const [recipes, setRecipes] = useState([]);
  

    useEffect(() => {
        async function fetchData() {
            const data = await fetchDataFromFirestore();
            setRecipes(data);
        }
        fetchData();
    },[]); //run once when the component loads and never again
    
const handleLogOut = (e) =>{

    e.preventDefault();
    const auth = getAuth();
    signOut(auth).then(() => {
        console.log("te ai deconectat")
        localStorage.removeItem("userUid");
        navigate('/');
      }).catch((error) => {
        // An error happened.
      })
.catch((error) => {
const errorCode = error.code;
const errorMessage = error.message;
});
}
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

     
      }, []); // Empty dependency array ensures that the effect runs once after the initial render
      
  
     
    
    

    return(
        <div>
            
            <body >
            
            <nav className="sidebar close">
            <header>
                <div className="image-text">
                    <span className="image">
                        <img src={logo} alt="logo" />
                    </span>
                    <div class="text header-text">
                        <span className="name">RecipeMatch</span>

                    </div>
                </div>
                {/* <input type="checkbox" id="check"/>
            <label for="check">
             <i class="fas fa-bars" id="btn"></i>
             <i class="fas fa-times" id="cancel"></i>
            </label> */}
                <box-icon name='chevron-right' class="chevron-right toggle" ></box-icon>

            </header>
            <div className="menu-bar">
                <div className="menu">
                <li className="search-box">
                            
                                <box-icon name='search' class="icon"></box-icon>
                                <input type="text" placeholder="Cauta..."/> 
                            
                        </li>
                    <ul className="menu-links">
                        <li className="nav-link">
                        <Link to='/profile'>
                                <box-icon name='food-menu' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Retete
                                </span>
                            </Link>
                        </li>
                        <li className="nav-link">
                        <Link to='/chat'>
                                <box-icon name='food-menu' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Grupuri
                                </span>
                            </Link>
                        </li>
                        <li className="nav-link">
                        <Link to='/profile'>
                                <box-icon name='food-menu' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Favorite
                                </span>
                            </Link>
                        </li>
                        <li className="nav-link">
                        <Link to='/profile'>
                                <box-icon name='food-menu' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Frigider
                                </span>
                            </Link>
                        </li>
                        <li className="nav-link">
                        <Link to='/profile'>
                                <box-icon name='food-menu' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Setari
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
                            <span className="mode-text text">Intunecat</span>    
                           <div className="toggle-switch">
                            <span className="switch"></span>
                           </div>
                        </li>
                    </div>
                
            </div>
            </nav>
            <div  className="main--content">
                <div className="header--wrapper">

            <div>Conectat ca: {user?.email}</div>
                <div class="container">
         
         

        <Cards />

              
       
    
      </div>
                </div>
                
                
                {/* <p>{user.email}</p> */}
                <div className="profile--wrapper">
                    <div className="profile--bar">
                    
                    <button class="add--recipe" ><box-icon name='plus'></box-icon>
                    </button>
                    <Link to='/profile'><img src={user?.photoURL || profile} /></Link>
                        
                        </div>
                        <Test/>
                        
                       </div>        
            </div>
            

                    <div className="header--title">
                       
                    </div>

                
                {/* <div className="recipes">asdas</div> */}
                {/* <p>{user.email}</p> */}
            

       </body> 
	
       </div>
    )
};