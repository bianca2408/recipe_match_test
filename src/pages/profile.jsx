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
import ImageModal from '../components/ImageModal.jsx'; // Importăm componenta modal




export default function Profile(){
    const user = auth.currentUser;
    const inputFileRef = useRef();
  
    const navigate = useNavigate();
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
            modeText.innerText = "Întunecat";
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
//INGREDIENTE DROPDOWNBOX//
const [ingrediente, setIngrediente] = useState([]);
const [searchTerm, setSearchTerm] = useState(""); // 1. Adăugarea stării pentru termenul de căutare

useEffect(() => {
    async function fetchData() {
        const data = await fetchDataFromFirestore();
        setIngrediente(data);
    }
    fetchData();
},[]); //run once when the component loads and never again




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
//UPLOAD IMAGINE RETETA IN FORM//
const [imageUploaded, setImageUploaded] = useState(false);

const handleImageUpload = () => {
  if (image == null) return;
  const nume_imagine = v4();
  const imageRef = ref(storage, `retete/${nume_imagine}`);
  
  uploadBytes(imageRef, image)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((url) => {
          // Actualizăm state-ul local pentru a afișa imaginea
          setForm({ ...form, imagine: url });
          console.log(url);
          setImageURL((prev) => [...prev, url]);
          // Actualizăm starea pentru a indica că imaginea a fost încărcată
          setImageUploaded(true);
        })
        .catch((error) => {
          console.error('Eroare la obținerea URL-ului de descărcare:', error);
        });
    })
    .catch((error) => {
      console.error('Eroare la încărcarea imaginii:', error);
    });
};




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
      ingrediente: [{ ingredientName: "", quantity: "" }],
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
  
     
  
          // Resetare stări
      setPopupActive(false);
      setEditMode(false);
      setFormTitle("Adaugă o nouă rețetă");
      setEditedRecipe(null);
      resetForm();
    
     
      
    }
  
    
    const handleIngredient = (e, i) => {
      const ingredientsClone = [...form.ingrediente];
      ingredientsClone[i] = { ingredientName: e.target.value, quantity: '' }; // Actualizare la un obiect care conține numele ingredientului și cantitatea inițială (sau o valoare golă)
      setForm({
        ...form,
        ingrediente: ingredientsClone
      });
    };
    
    const handleIngredientQuantity = (e, i) => {
      const ingredientsClone = [...form.ingrediente];
      ingredientsClone[i].quantity = e.target.value;
      setForm({
        ...form,
        ingrediente: ingredientsClone,
      });
    };
    
  
    const handleStep = (e, i) => {
      const stepsClone = [...form.instructiuni]
  
      stepsClone[i] = e.target.value
  
      setForm({
        ...form,
        instructiuni: stepsClone
      })
    }
    const handleIngredientDelete = (index) => {
      const ingredientsClone = [...form.ingrediente];
      ingredientsClone.splice(index, 1);
      setForm({
        ...form,
        ingrediente: ingredientsClone,
      });
    };
    
    const handleStepDelete = (index) => {
      const stepsClone = [...form.instructiuni];
      stepsClone.splice(index, 1);
      setForm({
        ...form,
        instructiuni: stepsClone,
      });
    };
    
  
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
  
    //RESET FORM//
    const [imageButtonState, setImageButtonState] = useState({
  text: "Incarca imaginea",
  color: "green"
});
const [formTitle, setFormTitle] = useState("Adaugă o nouă rețetă");
const resetForm = () => {
  setForm({
    titlu: "",
    descriere: "",
    ingrediente: [{ ingredientName: "", quantity: "" }],
    instructiuni: [],
    imagine: "",
    utilizator: user.uid
  });

};
    // INPUT IMAGINE PENTRU RETETE//
const imagesListRef = ref(storage, "retete/");
const uploadFile = (recipeId) => {
  if (image == null) return;
  setForm({...form, utilizator: user.uid})
  const nume_imagine= v4();
  console.log(nume_imagine)
  const imageRef = ref(storage, `retete/${nume_imagine}`);
  
  uploadBytes(imageRef, image)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then((url) => {
          // Actualizăm state-ul local pentru a afișa imaginea
          setForm({ ...form, imagine: url });
          console.log(url)
          setImageURL((prev) => [...prev, url]);
          
          
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
  setFormTitle("Modifică rețeta");
    setEditedRecipe(recipe);
    setPopupActive(true);
    setForm({
      titlu: recipe.titlu,
      descriere: recipe.descriere,
      ingrediente: recipe.ingrediente.map(ingredient => ({
        ingredientName: ingredient.ingredientName,
        quantity: ingredient.quantity
      })),
      instructiuni: [...recipe.instructiuni],
      imagine: recipe.imagine,
      utilizator: recipe.utilizator,
    });
    
  };
  const userUid = localStorage.getItem("userUid");
  const docRef = doc(database, "utilizatori", userUid);

// Obținerea datelor din document
getDoc(docRef)
  .then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const numeUtilizator = userData.nume_utilizator;
      const emailUtilizator = userData.email;
      const userId = userUid;

      // // Actualizarea conținutului elementelor <span> cu clasele corespunzătoare
      document.querySelector('.username').innerText = `Nume de utilizator: ${numeUtilizator}`;
      document.querySelector('.email').innerText = `Email: ${emailUtilizator}`;
      document.querySelector('.user-id').innerText = `User id: ${userId}`;
    } else {
      console.log("Documentul utilizatorului nu există.");
    }
  })
  .catch((error) => {
    console.error("Eroare la obținerea datelor utilizatorului:", error);
  });
  //INGREDIENTE PENTRU DROPBOX FORM//
  async function fetchDataFromFirestore(){
    const querySnapshot = await getDocs(collection(database, "ingrediente"));
    const data =[];
    querySnapshot.forEach((doc) => {
        const ingredienteData = doc.data();
        data.push({ id: doc.id, ...ingredienteData });
    });
    return data;
}
 // Funcție pentru eliminarea diacriticelor dintr-un text
 function removeDiacritics(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Înlocuiți filtrarea din map cu această funcție pentru a face abstractie de diacritice
const filteredIngredients = ingrediente.filter(ingredient =>
  removeDiacritics(ingredient.id.toLowerCase()).includes(removeDiacritics(searchTerm.toLowerCase()))
);

// Înlocuiți evenimentul onChange al câmpului de căutare cu această funcție pentru a face abstractie de diacritice
function handleSearch(event) {
  setSearchTerm(removeDiacritics(event.target.value));
}
const [selectedImageUrl, setSelectedImageUrl] = useState(null); // Stare pentru URL-ul imaginii selectate
const handleImageOpen = (imageUrl) => {
  setSelectedImageUrl(imageUrl);
};
const handleCloseImageModal = () => {
  setSelectedImageUrl(null);
};

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
                    <Link to='/'>
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

            <h2 style={{ textAlign: 'center', fontFamily: "Poppins, sans-serif", fontSize: '2rem', color: '#fff', marginTop: '20px', borderBottom: '2px solid lightgray' }}>Rețetele mele</h2>



            <div className="recipes">
  <ul className="cards">
    {recipes.map((recipe) => {
      // Verifică dacă utilizatorul din rețetă este același cu utilizatorul curent
      if (recipe.utilizator === user.uid) {
        return (
          <li className="cards_item" key={recipe.id}>
            <div className="card">
              <div className="card_image">
                {recipe.imagine && <img src={recipe.imagine} style={{cursor: 'pointer'}} alt={`Imagine pentru ${recipe.titlu}`} onClick={() => handleImageOpen(recipe.imagine)}/>}
              </div>
              <div className="card_content">
                <h2 className="card_title">{recipe.titlu}</h2>
                <div className="card_text">
                  {recipe.descriere && (
                    <div>
                      <h4>Descriere</h4>
                      <p dangerouslySetInnerHTML={{ __html: recipe.descriere }}></p>
                    </div>
                  )}
                  <h4>Ingrediente</h4>
                  <ul>
                    {recipe.ingrediente.map((ingredient, i) => (
                      <li key={i}>
                        {ingredient.ingredientName} - {ingredient.quantity}
                      </li>
                    ))}
                  </ul>
                  <h4>Instrucțiuni</h4>
                  <ol>
                    {recipe.instructiuni.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
                
              </div>
            </div>
           {/* Butonul de editare și ștergere pentru fiecare card în parte */}
           <div className="buttons">
              <div className="edit-delete-buttons">
                <button onClick={() => handleEditClick(recipe)}>
                  Editează
                </button>
                <button className="remove" onClick={() => handleRemove(recipe.id)}>
                  Șterge
                </button>
              </div>
            </div>
          </li>
        );
      }
      
      return null; // Returnează null pentru a ignora rețetele care nu corespund condiției
    })}
  </ul>
  {selectedImageUrl && <ImageModal imageUrl={selectedImageUrl} onClose={handleCloseImageModal} />}
</div>

{isModalOpen && (
  <Modal
    isOpen={isModalOpen}
    onConfirm={handleConfirmRemove}
    onClose={handleCloseModal}
  />
)}



       
       {popupActive && <div className="popup">
        <div className="popup-inner">
        <h2 style={{textAlign: 'center', fontFamily: "Poppins, sans-serif", fontSize: '2rem', color: '#fff', marginTop: '20px'}}>{formTitle}</h2>
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
     <button type="button" onClick={handleImageUpload}>
    {imageUploaded ? 'Imagine încărcată' : 'Încarcă imaginea'}
  </button>


</div>
<div className="form-group">
  <label>Descriere</label>
  <textarea 
    type="text" 
    value={form.descriere} 
    onChange={e => setForm({...form, descriere: e.target.value})} />
</div>

<div className="form-group" style={{  justifyContent: 'center', alignItems: 'center' }}>
  <label style={{ textAlign: 'center' }}>Ingrediente</label>
  {
  form.ingrediente.map((ingredient, i) => (
    <div key={i}>
      <select value={ingredient.ingredientName} onChange={(e) => handleIngredient(e, i)}>
        <option value="">Alegeți un ingredient</option>
        {filteredIngredients.map((ingrediente) => (
          <option key={ingrediente.id} value={ingrediente.nume_ingredient}>
            {ingrediente.nume_ingredient}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Cantitate"
        value={ingredient.quantity}
        onChange={(e) => handleIngredientQuantity(e, i)}
      />
      <button type="button" onClick={() => handleIngredientDelete(i)}>Elimină ingredient</button>
    </div>
  ))
}


  <button type="button" onClick={handleIngredientCount}>Adaugă ingredient</button>
</div>

<div className="form-group" style={{  justifyContent: 'center', alignItems: 'center' }}>
  <label style={{ textAlign: 'center' }}>Instrucțiuni</label>


  {
  form.instructiuni.map((step, i) => (
    <div key={i}>
      <textarea type="text" key={i} value={step} onChange={(e) => handleStep(e, i)} />
      <button type="button" onClick={() => handleStepDelete(i)}>Elimină instrucțiune</button>
    </div>
  ))
}
  <button type="button" onClick={handleStepCount}>Adaugă instrucțiune</button>
</div>

<div className="edit-delete-buttons">
  {/* Schimbă textul butonului și titlul formularului în funcție de modul de editare */}
  <button onClick={uploadFile} type="submit">
    {editMode ? 'Confirma modificari' : 'Publică Rețeta'}
  </button>
  <button type="button" onClick={() => {setPopupActive(false); resetForm(); setEditMode(false); setFormTitle("Adaugă o nouă rețetă");}}>Închide</button>
</div>


</form>


        </div>
        </div>}
      
               
  </div>
               
  <div className="profile--wrapper">
    <div className="cardProfile">
        <div className="card-header">
            <input
                id="file-input"
                type="file"
                ref={inputFileRef}
                style={{ display: 'none' }}
                onChange={handleChange}
            />
            <label htmlFor="file-input">
                <img
                    src={photoURL}
                    alt="Profile Image"
                    className="profile-img"
                />
            </label>
        </div>
        <div className="card-body">
            <p className="username">Nume de utilizator: </p>
            <a className="email">Email: </a>
            <p className="user-id">User id: </p>
            <button onClick={submitData}>Încarcă imagine profil</button>
            <button onClick={() => { setPopupActive(!popupActive); resetForm(); }} className="add--recipe">Adaugă rețetă</button>
        </div>
    </div>
</div>


            </div>
       </body> 
	
       </div>
    )
};