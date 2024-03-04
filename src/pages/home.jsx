
import React , {useEffect, useState} from "react";


import {Link, useNavigate} from "react-router-dom";
import 'boxicons';
import '../index.css';
import '../index.js';



import logo from '../assets/logo.png';
import profile from '../assets/profile.png';
import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";



import { getAuth, onAuthStateChanged } from "firebase/auth";


// import RecipeCard from 'react-tinder-card';
import { database } from '../firebase';
import { collection, doc, getDocs } from 'firebase/firestore';

async function fetchDataFromFirestore(){
const querySnapshot = await getDocs(collection(database, "retete"));
const data =[];
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  data.push({id: doc.id, ...doc.data()})
});
return data;
}




    




export default function Home(){

    const navigate = useNavigate();
    const user = auth.currentUser;
    const [recipes, setRecipes] = useState([
      
    ]);
   
    
 
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
        navigate('/login');
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
                <box-icon name='chevron-right' class="chevron-right toggle"></box-icon>
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
                        <Link to='/profile'>
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


                <div class="container">
         
            {/* <div className='cardContainer' >
            {recipes.map((reteta) => (
                <RecipeCard 
                    className="swipe"
                    key={reteta.nume_reteta}
                    preventSwipe={['up', 'down']}
                >
                    <div className='card' style={{ backgroundImage: `url(${reteta.url})` }} >
                        <h3>{reteta.nume_reteta}</h3>
                    </div>
                </RecipeCard>
            ))}
        </div>
        <div className="swipeButtons">
        <box-icon  type='solid' name='heart'></box-icon>
        <box-icon  type='solid' name='heart'></box-icon>
     </div> */}
    <div>Conectat ca: {user?.email}</div>
      </div>
                </div>
                
                
                {/* <p>{user.email}</p> */}
                <div className="profile--wrapper">
                    <div className="profile--bar">
                    
                    <button class="add--recipe" ><box-icon name='plus'></box-icon>
                    </button>
                    <Link to='/profile'><img src={user?.photoURL || profile} /></Link>
                        
                        
                        </div>
                        
                       </div>        
            </div>
            

                    <div className="header--title">
                        <span>asdad</span>
                    </div>

                
                {/* <div className="recipes">asdas</div> */}
                {/* <p>{user.email}</p> */}
            

       </body> 
	
       </div>
    )
};