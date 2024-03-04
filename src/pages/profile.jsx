import React , {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import 'boxicons';
import '../index.css';

import '../index.js';
import logo from '../assets/logo.png';

import profile from '../assets/profile.png';
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../firebase.js";

import { storage } from "../firebase.js";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../firebase.js";
import { database } from "../firebase.js";
import {  ref as ref2, set , onValue} from "firebase/database";
import Login from "./Login.jsx";

import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc
} from "firebase/firestore"





export default function Home(){
    const user = auth.currentUser;
    const inputFileRef = useRef();
  
    const navigate = useNavigate();
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
// PROFILE UPDATE // 
      const [image, setImage] = useState('null');
      const [loading, setLoading] = useState('false');
      const [photoURL, setUrl]=useState(profile);

//INPUT FILE PT POZA PROFIL//
      const handleChange= (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
      }
//BUTON DE INCARCARE A POZEI DE PROFIL//

  const submitData = ()=>{

const storageRef = ref(storage, `${user.uid}.png`);
uploadBytes(storageRef, image).then((snapshot) => {
  getDownloadURL(storageRef).then((url) => {
    setUrl(url);
    updateProfile(user, {photoURL: url})
  }).catch((error) => {
console.log(error.message)
  })
  
  alert("uploaded"+ user.photoURL)
  console.log('Uploaded a blob or file!');
}).catch((error) => {
  console.log(error.message);
});
}
useEffect(() =>{
  if(user && user.photoURL){
    setUrl(user.photoURL);
  }

},[user])
// INCARCARE RETETE
    const [recipes, setRecipes]=useState([])
    const [form, setForm] = useState({
      titlu: "",
      descriere: "",
      ingrediente: [],
      instructiuni: [],
      imagine: ""
    })
    const [popupActive, setPopupActive] = useState(false)
  
    const recipesCollectionRef = collection(database, "retete_utilizator")

    useEffect(() => {
      onSnapshot(recipesCollectionRef, snapshot => {
        setRecipes(snapshot.docs.map(doc => {
          return {
            id: doc.id,
            viewing: false,
            ...doc.data()
          }
        }))
        
      })
    },[])

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
    const handleSubmit = e => {
      e.preventDefault()
  
      if (
        !form.titlu ||
        !form.descriere ||
        !form.ingrediente ||
        !form.instructiuni 
        // !form.imagine
      ) {
        alert("Please fill out all fields")
        return
      }
  
      addDoc(recipesCollectionRef, form)
  
      setForm({
        titlu: "",
        descriere: "",
        ingrediente: [],
        instructiuni: [],
        imagine: ""
      })
  
      setPopupActive(false)
    }
  
    
    const handleIngredient = (e, i) => {
      const ingredientsClone = [...form.ingrediente]
  
      ingredientsClone[i] = e.target.value
  
      setForm({
        ...form,
        ingrediente: ingredientsClone
      })
    }
  
    const handleStep = (e, i) => {
      const stepsClone = [...form.instructiuni]
  
      stepsClone[i] = e.target.value
  
      setForm({
        ...form,
        instructiuni: stepsClone
      })
    }
  
    const handleIngredientCount = () => {
      setForm({
        ...form,
        ingrediente: [...form.ingrediente, ""]
      })
    }
  
    const handleStepCount = () => {
      setForm({
        ...form,
        instructiuni: [...form.instructiuni, ""]
      })
    }
  
    const removeRecipe = id => {
      deleteDoc(doc(database, "retete_utilizator", id))
    }
    return( 
        <div>
          {/* DACA USERUL NU ESTE LOGAT -  LOGIN PAGE */}
            {!user &&
            <>
            <Login/>
            </>}

            <body>
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
                            <a href="">
                                <box-icon name='food-menu' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Retete
                                </span>
                            </a>
                        </li>
                        <li className="nav-link">
                            <a href="">
                                <box-icon name='food-menu' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Grupuri
                                </span>
                            </a>
                        </li>
                        <li className="nav-link">
                            <a href="">
                                <box-icon name='food-menu' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Favorite
                                </span>
                            </a>
                        </li>
                        <li className="nav-link">
                            <a href="">
                                <box-icon name='food-menu' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Frigider
                                </span>
                            </a>
                        </li>
                        <li className="nav-link">
                            <a href="">
                                <box-icon name='food-menu' class="icon"></box-icon>
                                <span className="text nav-text">
                                    Setari
                                </span>
                            </a>
                        </li>
                    </ul>
                    </div>
                    <div className="bottom-content">
                    <li className="">
                            <a href="">
                            <box-icon onClick={handleLogOut} name='log-out' class="icon"></box-icon>
                                <span onClick={handleLogOut} className="text nav-text">
                                    Deconectare
                                </span>
                            </a>
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

          <h2>Retetele mele</h2>
        <div className="recipes">
          {recipes.map((recipe, i  )=> (
            <div className="recipe" key={recipe.id}>
             <img className="img_recipe" src={recipe.imagine}></img> 
             <h3>{recipe.titlu}</h3>
              <p dangerouslySetInnerHTML={{__html: recipe.descriere}}></p>

             {recipe.viewing && <div>
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
                
              </div>}
              <div className="buttons">
              <button onClick={() => handleView(recipe.id)}>View { recipe.viewing ? 'less': 'more'}</button>
              <button className="remove" onClick={() => removeRecipe(recipe.id)}>Remove</button>
              </div></div>
          ))}
        </div>
       
       {popupActive && <div className="popup">
        <div className="popup-inner">
          <h2>Adauga o noua reteta</h2>
          <form onSubmit={handleSubmit}>

<div className="form-group">
  <label>Titlu</label>
  <input 
    type="text" 
    value={form.titlu} 
    onChange={e => setForm({...form, titlu: e.target.value})} />
</div>
<div className="form-group">
  <label>Imagine</label>
  <div className="file-upload">
          {/* Ascundeți inputul real */}
          <input
            id="image-input" // Trebuie să fie aceeași cu id-ul "htmlFor" din label
            type="file"
            ref={inputFileRef}
            value={form.imagine}
            style={{ display: 'none' }}
            onChange={e => setForm({...form, imagine: e.target.value})}
          />
          {/* Folosește o imagine sau alt element pentru a declanșa încărcarea */}
          <label htmlFor="image-input"/>
          <img
            src={form.imagine}
              alt="Incarca"
            style={{
              width: '100px',
              height: '100px',
              // borderRadius: '50%',
              borderWidth: '5px',
              backgroundColor: '#FFF',
              borderColor: 'grey',
              borderStyle: 'outset',
                
              
            }}
          />
</div>

</div>
<div className="form-group">
  <label>Descriere</label>
  <textarea 
    type="text" 
    value={form.descriere} 
    onChange={e => setForm({...form, descriere: e.target.value})} />
</div>

<div className="form-group">
  <label>Ingrediente</label>
  {
    form.ingrediente.map((ingredient, i) => (
      <input 
        type="text"
        key={i}
        value={ingredient} 
        onChange={e => handleIngredient(e, i)} />
    ))
  }
  <button type="button" onClick={handleIngredientCount}>Adauga ingredient</button>
</div>

<div className="form-group">
  <label>Intructiuni</label>
  {
    form.instructiuni.map((step, i) => (
      <textarea 
        type="text"
        key={i}
        value={step} 
        onChange={e => handleStep(e, i)} />
    ))
  }
  <button type="button" onClick={handleStepCount}>Adauga instructiune</button>
</div>

<div className="buttons">
  <button type="submit">Submit</button>
  <button type="button" class="remove" onClick={() => setPopupActive(false)}>Close</button>
</div>

</form>


        </div>
        </div>}
      
               
  </div>
               
                <div className="profile--wrapper">
                    <div className="cardProfile">
                       
        <div className="file-upload">
          {/* Ascundeți inputul real */}
          <input
            id="file-input" // Trebuie să fie aceeași cu id-ul "htmlFor" din label
            type="file"
            ref={inputFileRef}
            style={{ display: 'none' }}
            onChange={handleChange}
          />
          {/* Folosește o imagine sau alt element pentru a declanșa încărcarea */}
          <label htmlFor="file-input">
          <img
            src={photoURL}
              alt="Incarca"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              borderWidth: '5px',
              backgroundColor: '#FFF',
              borderColor: 'grey',
              borderStyle: 'outset',
                
              
            }}
/>
          </label>
          <button  onClick={submitData}>Incarca</button>
        </div>
                    <div className="user-info">
                    <button onClick={() => setPopupActive(!popupActive)} class="add--recipe" >Adauga reteta
                    </button>
                      <span className="username">Bianca{user.displayName}</span>
                      <span className="email">{user.email}</span>

                    </div>
                    </div>
                    
                    
                    </div>
                        
                               
            </div>
            
       </body> 
	
       </div>
    )
};