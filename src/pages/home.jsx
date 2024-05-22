
import React , {useEffect, useState, Component} from "react";


import {Link, useNavigate} from "react-router-dom";

import '../index.css';
import '../index.js';

import Button from '../components/Button';
import Card from '../components/Card'
import Test from './filters.jsx'
import RecipeList from '../components/RecipeList.jsx';

import logo from '../assets/logo.png';
import profile from '../assets/profile.png';
import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import { database } from "../firebase.js";
import { collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore';


    
const userUid = localStorage.getItem("userUid");
async function fetchDataFromFirestore(){
    const querySnapshot = await getDocs(collection(database, "retete_utilizator"));
    const data =[];
    querySnapshot.forEach((doc) => {
        const cardData = doc.data();
        if (cardData.utilizator !== userUid) { // Excludem cardurile ale utilizatorului curent
          data.push({ id: doc.id, ...cardData });
      }
    });
    return data;
    }
//AFISARE RETETE PE BAZA FILTRU//
    async function fetchRecipesFromFirestore(selectedIngredients) {
      if (selectedIngredients.length === 0) {
       
        return []; // Returnează un array gol dacă nu sunt selectate ingrediente
      }
    
      const selectedIngredientIds = selectedIngredients.map(ingredient => ingredient.id);
      
    
      const recipesQuery = query(
        collection(database, "retete_utilizator"),
        where("ingrediente", "array-contains-any", selectedIngredientIds)
      );
    
      const querySnapshot = await getDocs(recipesQuery);
      const recipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
      
      return recipes;
    }

export default function Home(){

    const navigate = useNavigate();
    const user = auth.currentUser;
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [ingrediente, setIngrediente] = useState([]);
    const [hasFetchedRecipes, setHasFetchedRecipes] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false); // Adăugăm o stare pentru a urmări încărcarea datelor

  //FILTRU INGREDIENTE AFISARE RETETE//
    useEffect(() => {
      async function fetchRecipes() {
        setLoading(true); // Setăm starea de încărcare la true
        const recipesData = await fetchRecipesFromFirestore(selectedIngredients);
        
        setRecipes(recipesData);
        setHasFetchedRecipes(true); // Setăm că s-au descărcat rețetele
        setLoading(false); // Setăm starea de încărcare la false după ce am primit rezultatele
      
      }
      
      fetchRecipes();
    }, [selectedIngredients]);
  // CONSTANTE PENTRU AFISARE MENIU LA APASAREA POZEI DE PROFIL PE HOME
    const [menuOpened, setMenuOpened] = useState(false); // Starea pentru a urmări dacă meniul este deschis sau închis
    const toggleMenu = () => {
    setMenuOpened(prevState => !prevState); // Inversează starea pentru a deschide sau închide meniul
  };
  // FINAL
 function handleCheckboxChange(ingredient, checked) {
      if (checked) {
        setSelectedIngredients(prevSelectedIngredients => [...prevSelectedIngredients, ingredient]);
      } else {
        setSelectedIngredients(prevSelectedIngredients =>
          prevSelectedIngredients.filter(selectedIngredient => selectedIngredient.id !== ingredient.id)
        );
      }
     

 

      // Filtrarea retetelor corespunzatoare ingredientelor selectate
      const filteredRecipes = recipes.filter(recipe => {
        return selectedIngredients.every(selectedIngredient => {
          return recipe.ingrediente.includes(selectedIngredient.id);
        });
      });
      setFilteredRecipes(filteredRecipes);
    }
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
      
      const handleView = id =>{
        const recipesClone = [...recipes]
  
        recipesClone.forEach(recipe => {
          if(recipe.id === id){
            recipe.viewing = !recipe.viewing
          } else{
            recipe.viewing = false
          }
        })
        setRecipes(recipesClone)
      }
      

    return(
        <div>
            
            <body >
            
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
                        <Link to='/profile'>
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
            <div  className="main--content">
                <div className="header--wrapper">

            {/* <div>Conectat ca: {user?.email}</div> */}
               
                {/* <Cards /> */}
                <evil-tinder></evil-tinder>
            {/* Verificăm dacă au fost selectate ingrediente și dacă s-au descărcat rețetele */}
        {(selectedIngredients.length > 0 && hasFetchedRecipes && !loading) ? (
          recipes.length > 0 ? (
            <RecipeList recipes={recipes} />
          ) : (
            <p className="errorMessage">Nu există rețete disponibile pentru ingredientele selectate.</p>
          )
        ) : null}
           </div>
                
                
                <div className="profile--wrapper">
                <div className="profile--bar">
      {/* <button class="add--recipe" ><box-icon name='plus'></box-icon></button> */}
      <Link to='/profile'><img src={user?.photoURL || profile} onClick={toggleMenu} /></Link>
      
      {/* <div className="container">
        <div className={`menubtn ${menuOpened ? 'opened' : ''}`} onClick={toggleMenu}>
          
          <span></span>
        </div>
        <nav className={`navmenu ${menuOpened ? 'opened' : ''}`}>
        
          <h4>Menu</h4>
          <ul className="text-list">
            <li><a href="#">Home</a></li>
            <li><a href="#">Gallery</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </div> */}
    </div>
    
    <Test 
        setSelectedIngredients={setSelectedIngredients} 
        selectedIngredients={selectedIngredients}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        setIngrediente={setIngrediente}
        ingrediente={ingrediente}
        handleCheckboxChange={handleCheckboxChange} // Pasăm funcția de gestionare a selectării ingredientelor către componenta Test
      />
      
                        {/* {currentRecipe && (
        <div className="recipe">
         {currentRecipe && (
            <div className="recipe">
              {currentRecipe.imagine && (
                <img src={currentRecipe.imagine} alt={`Imagine pentru ${currentRecipe.titlu}`} />
              )}
              <h3>{currentRecipe.titlu}</h3>
              <div>
                <h4>Descriere</h4>
                <p dangerouslySetInnerHTML={{ __html: currentRecipe.descriere }}></p>
                <h4>Ingrediente</h4>
                <ul>
                  {currentRecipe.ingrediente.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
                <h4>Instructiuni</h4>
                <ol>
                  {currentRecipe.instructiuni.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>
      )} */}
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