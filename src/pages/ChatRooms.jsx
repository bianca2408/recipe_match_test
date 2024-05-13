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
import { getDoc, collection, getDocs, doc, addDoc, deleteDoc, setDoc, onSnapshot } from "firebase/firestore"
import Modal from "../components/Modal.js";
import Login from "./Login.jsx";
import ChatRoom from "../components/ChatRoom.jsx";

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

// FORMA CREARE GRUP PUBLIC SAU PRIVAT//
const [isOpen, setIsOpen] = useState(false); // Starea pentru a urmări dacă popup-ul este deschis sau închis
const [groupName, setGroupName] = useState(''); // Starea pentru a urmări numele grupului
const [groupDescription, setGroupDescription] = useState(''); // Starea pentru a urmări descrierea grupului
const [groupType, setGroupType] = useState('public'); // Starea pentru a urmări tipul grupului (public sau privat)
const [password, setPassword] = useState(''); // Starea pentru a urmări parola pentru grupurile private
const [isGroupCreated, setIsGroupCreated] = useState(false); // Starea pentru a urmări dacă grupul a fost creat

const togglePopup = () => {
  setIsOpen(prevState => !prevState); // Inversează starea pentru a deschide sau închide popup-ul
  
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (selectedGroup) {
      // Verificăm dacă un grup este deja selectat pentru editare
      const groupDocRef = doc(database, 'grupuri', selectedGroup.id); // Obținem referința către documentul grupului
      const updatedGroupData = {
        name: groupName,
        description: groupDescription,
        type: groupType,
        password: groupType === 'private' ? password : null,
      };
      await setDoc(groupDocRef, updatedGroupData, { merge: true }); // Actualizăm documentul grupului în Firebase
      console.log('Grupul a fost actualizat cu succes!');
      // Resetează valorile din formular
      setGroupName('');
      setGroupDescription('');
      setPassword('');
      setIsOpen(false); // Închide popup-ul de editare
      setSelectedGroup(null); // Deselectează grupul pentru editare
    } else {
      // Dacă nu există niciun grup selectat pentru editare, creează unul nou
      const groupData = {
        name: groupName,
        description: groupDescription,
        type: groupType,
        password: groupType === 'private' ? password : null,
        createdBy: user.uid,
      };
      const docRef = await addDoc(collection(database, 'grupuri'), groupData);
      console.log('Document written with ID: ', docRef.id);
      await addDoc(collection(database, `grupuri/${docRef.id}/chats`), {
        
    });
     
      setGroups([...groups, { id: docRef.id, ...groupData }]);
      setGroupName('');
      setGroupDescription('');
      setPassword('');
      setIsGroupCreated(true);
      setIsOpen(false);
      setTimeout(() => {
        setIsGroupCreated(false);
      }, 3000);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


  

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(database, 'grupuri'), (snapshot) => {
      const updatedGroups = [];
      snapshot.forEach((doc) => {
        updatedGroups.push({ id: doc.id, ...doc.data() });
      });
      setGroups(updatedGroups);
    });
  
    return () => unsubscribe();
  }, []);
  

// EDITARE GRUP//
// Funcția pentru deschiderea formularului de editare
const handleEditGroup = (group) => {
  setSelectedGroup(group);
  setGroupName(group.name);
  setGroupDescription(group.description);
  setGroupType(group.type);
  setPassword(group.password || ''); // Verificăm dacă parola este definită pentru grupurile private
  setIsOpen(true); // Deschidem popup-ul pentru editare
};

  //STERGERE GRUP//
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false); // Starea pentru a urmări dacă popup-ul este deschis sau închis

  const handleOpenModal = (groupId) => {
    setSelectedGroupId(groupId);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    
  };  
 // Definirea funcției handleDeleteGroup pentru ștergerea unui grup
 const handleDeleteGroup = async () => {
  try {
    console.log(selectedGroupId)
       // Construiește referința către colecția 'chats' pentru grupul selectat
       const chatsCollectionRef = collection(database, `grupuri/${selectedGroupId}/chats`);
       // Obține toate documentele din colecția 'chats' pentru grupul selectat
       const chatQuerySnapshot = await getDocs(chatsCollectionRef);
       // Șterge fiecare document din colecția 'chats'
       chatQuerySnapshot.forEach(async (doc) => {
           await deleteDoc(doc.ref);
       });

       // Construiește referința către documentul grupului
       const groupDocRef = doc(database, 'grupuri', selectedGroupId);
       // Șterge documentul grupului din baza de date
       await deleteDoc(groupDocRef);

       // Actualizează starea locală pentru a reflecta ștergerea grupului
       setGroups(groups.filter(group => group.id !== selectedGroupId));
      // Opcional: afișează un mesaj de succes sau efectuează alte acțiuni necesare
      console.log('Grupul a fost șters cu succes!');

      // Închide modalul după ștergere
      setIsOpenModal(false);
  } catch (error) {
      console.error('Eroare la ștergerea grupului:', error);
  }
};
// EXTINDERE DESCRIERE GRUP//

const [expandedItems, setExpandedItems] = useState({});

const toggleExpand = ( groupId) => {
 
  setExpandedItems(prevState => ({
    ...prevState,
    [groupId]: !prevState[groupId]
  }));
};

// AFISARE CONVERSATIE GRUP//
const [showConversation, setShowConversation] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
const [passwordGroup, setPasswordGroup] = useState('');
const [currentGroupName, setCurrentGroupName] = useState("Grupuri de chat");
  // Funcția pentru afișarea conversației grupului selectat
  const handleGroupClick = (group) => {

      setSelectedGroup(group);
      setSelectedGroupId(group.id); 
      setCurrentGroupName(group.name);
      if (group.type === 'private') {
        if (group.createdBy === user.uid) {
          // Dacă utilizatorul curent este cel care a creat grupul, afișează direct conversația grupului
          setShowConversation(true);
        } else {
          // Altfel, afișează un prompt pentru introducerea parolei
          const enteredPassword = prompt('Introduceți parola grupului:');
          if (enteredPassword === group.password) {
            setShowConversation(true);
            
          } else {
            // Afișează un mesaj de eroare dacă parola este incorectă
            window.alert('Parola introdusă este incorectă. Vă rugăm să încercați din nou.');
          }
        }
      } else {
        setShowConversation(true);
      }
    
  };
  
  

  // Funcția pentru revenirea la lista de grupuri
  const handleBackButtonClick = () => {
    setCurrentGroupName('Grupuri de chat');
    setShowConversation(false);
    setSelectedGroup(null);
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
                        <Link to='/profile'>
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
          
          <h2 style={{ textAlign: 'center', fontFamily: "Poppins, sans-serif", fontSize: '2rem', color: '#fff', marginTop: '20px', borderBottom: '2px solid lightgray' }}>{currentGroupName}</h2>

  <div>
      {showConversation ? (
        <div>
         
         {selectedGroupId && <ChatRoom groupId={selectedGroupId} />}
          <button onClick={handleBackButtonClick}>Înapoi</button>
        </div>
      ) : (
          <div>
      <ul>
        {groups.filter(group => group.createdBy !== user.uid).map((group) => (
          <li key={group.id} className="group-item" onClick={() => handleGroupClick(group)}>
    <div className="group-info">
  <strong>{group.name}</strong> -{" "}
  {expandedItems[group.id] ? group.description : `${group.description.slice(0, 50)}`}
  {group.description.length > 50 && (
    <span className="expand-text" onClick={(e) => {e.stopPropagation(); toggleExpand(group.id)}}>
      {expandedItems[group.id] ? ' ...mai puțin' : ' ...mai mult'}
    </span>
  )}
</div>
            <div className="group-actions">
            {group.type === 'private' && <box-icon type='solid' name='lock-alt' ></box-icon>} {/* Adăugăm iconița cu lacăt pentru grupurile private */}
          </div>
          </li>
        ))}
      </ul>
        
    </div>
      )} </div>
</div>
          <div className="profile--wrapper">
                <div className="profile--bar">
      {/* <button class="add--recipe" ><box-icon name='plus'></box-icon></button> */}
      <Link to='/profile'><img src={user?.photoURL || profile}  /></Link>
     
    </div> 
    <div class="group-content">
    <button className="add--group" onClick={togglePopup}>Crează grup</button>
      {/* Verifică dacă popup-ul este deschis și afișează-l */}
      {isOpen && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            <label>
              Numele grupului:
              <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
            </label>
            <label>
              Descrierea grupului:
              <textarea value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} required />
            </label>
            <label>
              Tipul grupului:
              <select value={groupType} onChange={(e) => setGroupType(e.target.value)}>
                <option value="public">Public</option>
                <option value="private">Privat</option>
              </select>
            </label>
            {groupType === 'private' && (
              <label>
                Parola grupului:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
            )}
            <button type="submit">Trimite</button>
            <button className="close-btn" onClick={() => {setIsOpen(false) ; setSelectedGroup(null)}}>Închide</button>
          </form>
        </div>
      )}
     {/* Afișează mesajul de succes dacă grupul a fost creat */}
     {isGroupCreated && (
        <div className="success-message">Grupul a fost creat cu succes!</div>
      )}
               <div>
      
      <ul>
      {groups.filter(group => group.createdBy === user.uid).map((group) => (
    <li key={group.id} className={`group-item ${selectedGroup && selectedGroup.id === group.id ? 'active' : ''}`} onClick={() => handleGroupClick(group)}>
  <div className="group-info">
  <strong>{group.name}</strong> -{" "}
  {expandedItems[group.id] ? group.description : `${group.description.slice(0, 15)}`}
  {group.description.length > 15 && (
    <span className="expand-text" onClick={(e) => {e.stopPropagation(); toggleExpand(group.id)}}>
      {expandedItems[group.id] ? ' ...mai puțin' : ' ...mai mult'}
    </span>
  )}
</div>
    <div className="group-actions">
     {group.type === 'private' && 
        <box-icon type='solid' name='lock-alt' style={{marginRight: '8px'}} ></box-icon>
      }
      <button className="edit-group-btn" onClick={(e) => { e.stopPropagation(); handleEditGroup(group) }}>
    <box-icon type='solid' name='edit-alt'></box-icon>
        </button>
      <button className="delete-group-btn" onClick={(e) => { e.stopPropagation(); handleOpenModal(group.id) }}>
        <box-icon type='solid' name='trash'></box-icon>
      </button>
     
    </div>
  </li>
))}
 <Modal
        isOpen={isOpenModal}
        onClose={handleCloseModal}
        onConfirm={handleDeleteGroup}
      />

      </ul>
    </div>      
      </div>
    </div>
          </div>
       
      </body>
    </div>
  );
}
