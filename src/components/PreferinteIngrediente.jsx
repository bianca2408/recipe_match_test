import React, { useState, useEffect } from 'react';
import { database, auth } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import '../Stilizare/PreferinteIngrediente.css';

const PreferinteIngrediente = ({ dislikedIngredients, selectedIngredients,  setSelectedIngredients }) => {

  const [showAdditionalIngredients, setShowAdditionalIngredients] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [allIngredients, setAllIngredients] = useState([]);
  const userUid = localStorage.getItem("userUid");

  useEffect(() => {
    const fetchUserPreferredIngredients = async () => {
      try {
        const userDocRef = doc(database, 'utilizatori', userUid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.ingrediente_preferate) {
            setSelectedIngredients(userData.ingrediente_preferate);
          }
        } else {
          console.error('Documentul utilizatorului nu există.');
        }
      } catch (error) {
        console.error('Eroare la obținerea ingredientelor preferate ale utilizatorului:', error);
      }
    };

    const fetchAllIngredients = async () => {
      try {
        const ingredientCollection = collection(database, 'ingrediente');
        const ingredientSnapshot = await getDocs(ingredientCollection);
        const ingredientData = ingredientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllIngredients(ingredientData);
      } catch (error) {
        console.error('Eroare la obținerea tuturor ingredientelor:', error);
      }
    };

    fetchUserPreferredIngredients();
    fetchAllIngredients();
  }, [userUid]);

  useEffect(() => {
    const updateUserPreferredIngredients = async () => {
      try {
        const userDocRef = doc(database, 'utilizatori', userUid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          await updateDoc(userDocRef, { ingrediente_preferate: selectedIngredients });
        } else {
          console.error('Documentul utilizatorului nu există.');
        }
      } catch (error) {
        console.error('Eroare la actualizarea ingredientelor preferate ale utilizatorului:', error);
      }
    };

    updateUserPreferredIngredients();
  }, [selectedIngredients, userUid]);

  const handleIngredientClick = (ingredientId) => {
    if (dislikedIngredients.includes(ingredientId)) {
      // Dacă este, nu face nimic
      return;
    }
    console.log('Clicked Ingredient ID:', ingredientId);
    const newSelectedIngredients = selectedIngredients.includes(ingredientId)
      ? selectedIngredients.filter(id => id !== ingredientId)
      : [...selectedIngredients, ingredientId];
    setSelectedIngredients(newSelectedIngredients);
  };

  const handleAddAllIngredientsClick = () => {
    setSelectedIngredients(allIngredients.map(ingredient => ingredient.id));
  };

  const handleToggleAdditionalIngredients = () => {
    if (showAdditionalIngredients) {
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setShowAdditionalIngredients(false);
      }, 500);
    } else {
      setShowAdditionalIngredients(true);
    }
  };

  const handleRemoveSelectedIngredient = (ingredientIdToRemove) => {
    const updatedSelectedIngredients = selectedIngredients.filter(id => id !== ingredientIdToRemove);
    setSelectedIngredients(updatedSelectedIngredients);
  };

  return (
    <div className='preferred-ingredients-section'>
      <h2>Ingredientele Preferate</h2>
      <p>Selectează din ingredientele de mai jos pentru a personaliza recomandările de rețete.</p>

      <div className="selected-ingredients-container">
        {selectedIngredients.map(ingredientId => {
          const ingredient = allIngredients.find(i => i.id === ingredientId);
          if (!ingredient) return null;
          return (
            <div key={ingredient.id} className="selected-ingredient" onClick={() => handleRemoveSelectedIngredient(ingredient.id)}>
              <div className="ingredient-elements">
                <span>{ingredient.nume_ingredient}</span>
              </div>
              <div className="delete-icon">X</div>
            </div>
          );
        })}
      </div>

      <button className='add-additional-ingredients-button' onClick={handleToggleAdditionalIngredients}>
        + Adaugă ingrediente
      </button>

      <div className={`additional-ingredients-container ${!showAdditionalIngredients && !animating ? 'hidden-container' : ''}`}>
        <div className={`ingredients-list ${showAdditionalIngredients && !animating ? 'visible' : 'hidden'}`}>
          {allIngredients.map(ingredient => (
            <div
              key={ingredient.id}
              className={`ingredient ${selectedIngredients.includes(ingredient.id) ? 'selected' : ''}`}
              onClick={() => handleIngredientClick(ingredient.id)}
            >
              <div className='ingredient-elements'>
                <span>{ingredient.nume_ingredient}</span>
              </div>
            </div>
          ))}
        </div>
        <button className='add-all-ingredients-button' onClick={handleAddAllIngredientsClick}>
          Adaugă Toate Ingredientele Preferate
        </button>
      </div>
    </div>
  );
};

export default PreferinteIngrediente;