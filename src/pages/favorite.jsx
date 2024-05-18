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
  const handleView = (id) => {
    const updatedRecipes = recipes.map(recipe => {
      if (recipe.id === id) {
        return { ...recipe, viewing: !recipe.viewing };
      } else {
        return { ...recipe, viewing: false };
      }
    });
    setRecipes(updatedRecipes);
  };
  
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userUid = localStorage.getItem("userUid");
      const userDocRef = doc(database, "utilizatori", userUid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const favoriteRecipeIds = userData.favorite || [];
          const favoriteRecipes = [];
          // Interogare pentru a obține doar rețetele favorite ale utilizatorului
          const querySnapshot = await getDocs(collection(database, "retete_utilizator"));
          querySnapshot.forEach((doc) => {
            if (favoriteRecipeIds.includes(doc.id)) {
              favoriteRecipes.push({ id: doc.id, ...doc.data() });
            }
          });
          setRecipes(favoriteRecipes);
        } else {
          console.log("Documentul utilizatorului nu există!");
        }
      } catch (error) {
        console.error("Eroare la citirea documentului utilizatorului:", error);
      }
    };
    fetchData();
  }, []);
  //STERGERE RETETA DE LA FAVORITE//
  const handleDelete = async (recipeId) => {
    const userUid = localStorage.getItem("userUid");
    const userDocRef = doc(database, "utilizatori", userUid);
    try {
      await updateDoc(userDocRef, {
        favorite: arrayRemove(recipeId)
      });
      // Update the local state to remove the deleted recipe
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error("Eroare la ștergerea rețetei din favorite:", error);
    }
  };
//MODAL PENTRU CONFIRMARE STERGERE//
const [isModalOpen, setIsModalOpen] = useState(false);
const [recipeToDelete, setRecipeToDelete] = useState(null);

const openModal = (recipeId) => {
  setRecipeToDelete(recipeId);
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
  setRecipeToDelete(null);
};

const handleConfirmDelete = () => {
  if (recipeToDelete) {
    handleDelete(recipeToDelete);
  }
  closeModal();
};

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
        <div className="main--content">
          <div className="header--wrapper">
          
          <h2 style={{ textAlign: 'center', fontFamily: "Poppins, sans-serif", fontSize: '2rem', color: '#fff', marginTop: '20px', borderBottom: '2px solid lightgray' }}>Rețete favorite</h2>

            
            <div className="recipes">
              {recipes.map((recipe) => (
                <div className="recipe" key={recipe.id}>
                  {recipe.imagine && <img src={recipe.imagine} alt={`Imagine pentru ${recipe.titlu}`} />}
                  <h3>{recipe.titlu}</h3>
                  {recipe.viewing && (
                    <div>
                      <h4>Descriere</h4>
                      <p dangerouslySetInnerHTML={{ __html: recipe.descriere }}></p>
                      <h4>Ingrediente</h4>
                      <ul>
                        {recipe.ingrediente.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                      <h4>Instructiuni</h4>
                      <ol>
                        {recipe.instructiuni.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  <div className="buttons">
                    <button onClick={() => handleView(recipe.id)}>
                      Vezi {recipe.viewing ? 'mai putin' : 'mai mult'}
                    </button>
                    <button className="remove" style={{marginTop: '1rem'}} onClick={() => openModal(recipe.id)}>
                      Sterge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleConfirmDelete} />
      </body>
    </div>
  );
}
