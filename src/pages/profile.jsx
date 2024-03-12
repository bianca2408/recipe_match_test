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
import { db } from "../firebase.js";
import { database } from "../firebase.js";
import {  ref as ref2, set , onValue} from "firebase/database";
import Login from "./Login.jsx";
import {v4} from "uuid";
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc
} from "firebase/firestore"

import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
  deleteObject,
} from "firebase/storage";
import Modal from "../components/Modal.js";



export default function Home(){
    const user = auth.currentUser;
    const inputFileRef = useRef();
  
    const navigate = useNavigate();
    const handleLogOut = (e) =>{
    e.preventDefault();
    const auth = getAuth();
    signOut(auth).then(() => {
        console.log("te ai deconectat")
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
// PROFILE UPDATE // 
      const [image, setImage] = useState('null');
      const [loading, setLoading] = useState('false');
      const [photoURL, setUrl]=useState(profile);
      const [imageURL, setImageURL]=useState([]);


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
      imagine: "",
      utilizator: ""
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
        alert("Completati toate campurile")
        return
      }
  
      if (editMode) {
      // Modul de editare: actualizează rețeta existentă
      if (image) {
        // Dacă ai o imagine nouă, actualizează-o
        uploadFile(editedRecipe.id);
      } 
        // Dacă nu ai o imagine nouă, actualizează doar rețeta existentă
      updateRecipeInDatabase(editedRecipe.id, form);
      
     
    } else {
      // Modul de adăugare: adaugă rețeta nouă
      addDoc(recipesCollectionRef, form);
    }
  
      setForm({
        titlu: "",
        descriere: "",
        ingrediente: [],
        instructiuni: [],
        imagine: "",
        utilizator: ""
      })
  
       setPopupActive(false);
      setEditMode(false);
      setEditedRecipe(null);
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
    // INPUT IMAGINE PENTRU RETETE//
const imagesListRef = ref(storage, "retete/");
const uploadFile = (recipeId) => {
  if (image == null) return;
  setForm({...form, utilizator: user.uid}
    )
  const nume_imagine= v4();
console.log(nume_imagine)
  const imageRef = ref(storage, `retete/${nume_imagine}`);
  
  uploadBytes(imageRef, image)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((url) => {
          // Actualizăm state-ul local pentru a afișa imaginea
          setImageURL((prev) => [...prev, url]);
          setForm({ ...form, imagine: url });
          updateRecipeInDatabase(recipeId, { imagine: url });
          
        })
        .catch((error) => {
          console.error('Eroare la obținerea URL-ului de descărcare:', error);
        });
    })
    .catch((error) => {
      console.error('Eroare la încărcarea imaginii:', error);
    });
};
useEffect(() => {
  listAll(imagesListRef).then((response) => {
    response.items.forEach((item) => {
      getDownloadURL(item).then((url) => {
        setImageURL((prev) => [...prev, url]);
      });
    });
  });
}, []);
    const setAuth = () => {
    setForm({...form, utilizator: user.uid}
    )}
    const deleteImageFromStorage = async (imageUrl) => {
      try {
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
        console.log('Imaginea a fost ștearsă cu succes din Storage.');
      } catch (error) {
        console.error('Eroare la ștergerea imaginii din Storage:', error);
      }
    };
    
    const removeRecipe = async (id, imageUrl) => {
      try {
        // Șterge imaginea din Storage
        if (imageUrl) {
          await deleteImageFromStorage(imageUrl);
        }
    
        // Șterge documentul din baza de date
        await deleteDoc(doc(database, 'retete_utilizator', id));
    
        console.log('Rețeta și imaginea au fost șterse cu succes.');
      } catch (error) {
        console.error('Eroare la ștergerea rețetei și a imaginii:', error);
      }
    };
    
//UPDATE RETETE//
  const updateRecipeInDatabase = async (recipeId, updatedData) => {
  try {
    // Referință la documentul specific retetei
    const recipeDocRef = doc(recipesCollectionRef, recipeId);

    // Actualizează documentul cu noile date
    await updateDoc(recipeDocRef, updatedData);

    console.log('Reteta a fost actualizată cu succes în baza de date!');
  } catch (error) {
    console.error('Eroare în actualizarea rețetei:', error.message);
  }
};

  //POPUP PENTRU STERGERE RETETA//
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipeIdToRemove, setRecipeIdToRemove] = useState(null);
    
  
    const handleRemove = (id) => {
      setIsModalOpen(true);
      setRecipeIdToRemove(id);
    };
  
    const handleConfirmRemove = () => {
      const recipeToRemove = recipes.find(recipe => recipe.id === recipeIdToRemove);
    
      if (recipeToRemove) {
        const imageUrlToDelete = recipeToRemove.imagine || null;
        removeRecipe(recipeIdToRemove, imageUrlToDelete);
      }
    
      setIsModalOpen(false);
    };
    
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setRecipeIdToRemove(null);
    };
// PENTRU EDITARE RETETA//
const [editMode, setEditMode] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(null);

  const handleEditClick = (recipe) => {
    setEditMode(true);
    setEditedRecipe(recipe);
    setPopupActive(true);
    setForm({
      titlu: recipe.titlu,
      descriere: recipe.descriere,
      ingrediente: [...recipe.ingrediente],
      instructiuni: [...recipe.instructiuni],
      imagine: recipe.imagine,
      utilizator: recipe.utilizator,
    });
  };
  //STERGERE RETETA//
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

            <h2 style={{textAlign: 'center', fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#fff', marginTop: '20px'}}>Retetele mele</h2>



          <div className="recipes">
  {recipes.map((recipe) => {
    // Verifică dacă utilizatorul din rețetă este același cu utilizatorul curent
    if (recipe.utilizator === user.uid) {
      
      return (
        <div className="recipe" key={recipe.id}>
          
          {/* <h4>Postat de {recipe.utilizator}</h4> */}
          
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
            
            <button onClick={() =>  handleView(recipe.id)}>
              Vezi {recipe.viewing ? 'mai putin' : 'mai mult'}
            </button>
            <div className="edit-delete-buttons" >
            <button onClick={() => handleEditClick(recipe)}>
              Editeaza
            </button>
            <button className="remove" onClick={() => handleRemove(recipe.id)}>
              Sterge
            </button>
          </div></div>
          {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onConfirm={handleConfirmRemove}
          onClose={handleCloseModal}
        />
      )}
        </div>
      );
    
    
    
    
    }

    return null; // Returnează null pentru a ignora rețetele care nu corespund condiției
  })}
</div>

       
       {popupActive && <div className="popup">
        <div className="popup-inner">
        <h2 style={{textAlign: 'center', fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#fff', marginTop: '20px'}}>Adauga o noua reteta</h2>
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
  <input
        type="file"
        
        onChange={(event) => {
          setImage(event.target.files[0]);
          
        }}
      />
      

     
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
  <label>Instructiuni</label>
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

<div className="edit-delete-buttons">
  <button onClick={uploadFile} type="submit">Submit</button>
  <button type="button"  onClick={() => setPopupActive(false)}>Close</button>
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
                    <br></br>
                     
                      <span className="username">Nume: {user.displayName}</span>
                      <br></br>
                      <span className="email">Email: {user.email}</span>
<br></br>
                      <span className="email">User id: {user.uid}</span>
                    </div>
                    
                    
                    
                    </div>
                        
                               
            </div>
            </div>
       </body> 
	
       </div>
    )
};