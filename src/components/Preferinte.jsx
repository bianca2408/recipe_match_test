import React, { useState } from 'react';

// Import imagini pentru fiecare alergen
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
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  
  // Adaugă calea imaginii pentru fiecare alergen
  const allAllergens = [
    { name: 'OUĂ', id: 'egg-free', image: eggImage }, // Poate fi null dacă nu există o imagine asociată
    { name: 'LACTATE', id: 'dairy-free', image: dairyImage },
    { name: 'ALUNE', id: 'peanut-free', image: peanutImage },
    { name: 'NUCI', id: 'tree-nut-free', image: acornImage },
    { name: 'PEȘTE', id: 'seafood-free', image: fishImage },
    { name: 'FRUCTE DE MARE', id: 'seafood-free', image: seafoodImage },
    { name: 'GRÂU', id: 'wheat-free', image: wheatImage }, // Imaginea asociată alergenului 'GRÂU'
    { name: 'SOIA', id: 'soy-free', image: soyImage },
    { name: 'SUSAN', id: 'sesame-free', image: sesameImage },
  ];

  const [showAdditionalAllergens, setShowAdditionalAllergens] = useState(false);

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
    setShowAdditionalAllergens((prevState) => !prevState);
  };

  return (
    <div className="allergens-section">
      <h2>Alergii</h2>
      <p>Selectați din alergiile de mai jos și vom afișa doar rețetele care se potrivesc.</p>
      
      <button className="add-additional-allergens-button" onClick={handleToggleAdditionalAllergens}>
        + Adaugă alergii
      </button>
      {showAdditionalAllergens && (
        <div className="additional-allergens-container">
          <div className="allergens-list">
            {allAllergens.map((allergen) => (
              <div 
                key={allergen.id}
                className={`allergen ${selectedAllergens.includes(allergen.id) ? 'selected' : ''}`}
                onClick={() => handleAllergenClick(allergen.id)}
              >
                <div className="allergen-elements">
              {allergen.image && <img src={allergen.image} alt={allergen.name} className="allergen-image" />}
      <span >{allergen.name}</span></div>
              </div>
            ))}
          </div>
          <button className="add-all-allergens-button" onClick={handleAddAllergiesClick}>
            Adaugă toate alergiile
          </button>
        </div>
      )}
    </div>
  );
};

export default Allergens;
