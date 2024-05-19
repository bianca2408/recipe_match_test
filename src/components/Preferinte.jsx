import React, { useState, useEffect } from 'react';
import { database, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import '../Stilizare/Preferinte.css'

import acornImage from '../assets/acorn.png';
import dairyImage from '../assets/dairy.png';
import eggImage from '../assets/egg-fried.png';
import fishImage from '../assets/fish.png';
import peanutImage from '../assets/peanut.png';
import sesameImage from '../assets/sesame.png';
import seafoodImage from '../assets/shrimp.png';
import soyImage from '../assets/soy.png';
import wheatImage from '../assets/wheat.png';

const Allergens = () => {
  const user = auth.currentUser;
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [showAdditionalAllergens, setShowAdditionalAllergens] = useState(false);
  const [animating, setAnimating] = useState(false);

  const allAllergens = [
    { name: 'OUĂ', id: 'oua', image: eggImage },
    { name: 'LACTATE', id: 'lactate', image: dairyImage },
    { name: 'ALUNE', id: 'alune', image: peanutImage },
    { name: 'NUCI', id: 'nuci', image: acornImage },
    { name: 'PEȘTE', id: 'peste', image: fishImage },
    { name: 'FRUCTE DE MARE', id: 'frute_mare', image: seafoodImage },
    { name: 'GRÂU', id: 'grau', image: wheatImage },
    { name: 'SOIA', id: 'soia', image: soyImage },
    { name: 'SUSAN', id: 'susan', image: sesameImage },
  ];

  const handleAllergenClick = (allergen) => {
    const newSelectedAllergens = selectedAllergens.includes(allergen)
      ? selectedAllergens.filter((a) => a !== allergen)
      : [...selectedAllergens, allergen];
    setSelectedAllergens(newSelectedAllergens);
  };

  const handleAddAllergiesClick = () => {
    setSelectedAllergens(allAllergens.map((allergen) => allergen.id));
  };

  const handleToggleAdditionalAllergens = () => {
    if (showAdditionalAllergens) {
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setShowAdditionalAllergens(false);
      }, 500); // Durata animației de dispariție
    } else {
      setShowAdditionalAllergens(true);
    }
  };

  useEffect(() => {
    const fetchUserAllergies = async () => {
      try {
        const userDocRef = doc(database, 'utilizatori', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.alergii) {
            setSelectedAllergens(userData.alergii);
          }
        } else {
          console.error('Documentul utilizatorului nu există.');
        }
      } catch (error) {
        console.error('Eroare la obținerea alergiilor utilizatorului:', error);
      }
    };

    fetchUserAllergies();
  }, [user.uid]);

  useEffect(() => {
    const updateUserAllergies = async () => {
      try {
        const userDocRef = doc(database, 'utilizatori', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          await updateDoc(userDocRef, { alergii: selectedAllergens });
        } else {
          console.error('Documentul utilizatorului nu există.');
        }
      } catch (error) {
        console.error('Eroare la actualizarea alergiilor utilizatorului:', error);
      }
    };

    updateUserAllergies();
  }, [selectedAllergens, user.uid]);
  const handleRemoveSelectedAllergen = (allergenIdToRemove) => {
    const updatedSelectedAllergens = selectedAllergens.filter((allergenId) => allergenId !== allergenIdToRemove);
    setSelectedAllergens(updatedSelectedAllergens);
  };
  

  return (
    <div className="allergens-section">
      <h2>Alergii</h2>
      <p>Selectați din alergiile de mai jos și vom afișa doar rețetele care se potrivesc.</p>
      <div className="selected-allergens-container">
  {selectedAllergens.map((allergenId) => {
    const allergen = allAllergens.find((a) => a.id === allergenId);
    return (
      <div key={allergen.id} className="selected-allergen" onClick={() => handleRemoveSelectedAllergen(allergen.id)}>
        <div className="allergen-elements">
          {allergen.image && <img src={allergen.image} alt={allergen.name} className="allergen-image" />}
          <span>{allergen.name}</span>
        </div>
        <div className="delete-icon">X</div>
      </div>
    );
  })}
</div>



      <button className="add-additional-allergens-button" onClick={handleToggleAdditionalAllergens}>
        + Adaugă alergii
      </button>
      <div className={`additional-allergens-container ${!showAdditionalAllergens && !animating ? 'hidden-container' : ''}`}>
        <div className={`allergens-list ${showAdditionalAllergens && !animating ? 'visible' : 'hidden'}`}>
          {allAllergens.map((allergen) => (
            <div
              key={allergen.id}
              className={`allergen ${selectedAllergens.includes(allergen.id) ? 'selected' : ''}`}
              onClick={() => handleAllergenClick(allergen.id)}
            >
              <div className="allergen-elements">
                {allergen.image && <img src={allergen.image} alt={allergen.name} className="allergen-image" />}
                <span>
                  {allergen.name}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="add-all-allergens-button" onClick={handleAddAllergiesClick}>
          Adaugă toate alergiile
        </button>
      </div>
    </div>
  );
};

export default Allergens;
