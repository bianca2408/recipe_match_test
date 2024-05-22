import React, { useState, useEffect } from 'react';
import { database, auth } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import '../Stilizare/IngredienteNedorite.css';

const IngredienteNedorite = ({ dislikedIngredients, setDislikedIngredients,  selectedIngredients }) => {

  const [showAdditionalIngredients, setShowAdditionalIngredients] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [allIngredients, setAllIngredients] = useState([]);
  const userUid = localStorage.getItem("userUid");

  useEffect(() => {
    const fetchUserDislikedIngredients = async () => {
      try {
        const userDocRef = doc(database, 'utilizatori', userUid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.ingrediente_nepreferate) {
            setDislikedIngredients(userData.ingrediente_nepreferate);
          }
        } else {
          console.error('Documentul utilizatorului nu există.');
        }
      } catch (error) {
        console.error('Eroare la obținerea ingredientelor nepreferate ale utilizatorului:', error);
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

    fetchUserDislikedIngredients();
    fetchAllIngredients();
  }, [userUid]);

  useEffect(() => {
    const updateUserDislikedIngredients = async () => {
      try {
        const userDocRef = doc(database, 'utilizatori', userUid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          await updateDoc(userDocRef, { ingrediente_nepreferate: dislikedIngredients });
        } else {
          console.error('Documentul utilizatorului nu există.');
        }
      } catch (error) {
        console.error('Eroare la actualizarea ingredientelor nepreferate ale utilizatorului:', error);
      }
    };

    updateUserDislikedIngredients();
  }, [dislikedIngredients, userUid]);

  const handleIngredientClick = (ingredientId) => {
    if ( selectedIngredients.includes(ingredientId)) {
      // Dacă este, nu face nimic
      return;
    }
    const newDislikedIngredients = dislikedIngredients.includes(ingredientId)
      ? dislikedIngredients.filter(id => id !== ingredientId)
      : [...dislikedIngredients, ingredientId];
    setDislikedIngredients(newDislikedIngredients);
  };

  const handleAddAllIngredientsClick = () => {
    setDislikedIngredients(allIngredients.map(ingredient => ingredient.id));
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

  const handleRemoveDislikedIngredient = (ingredientIdToRemove) => {
    const updatedDislikedIngredients = dislikedIngredients.filter(id => id !== ingredientIdToRemove);
    setDislikedIngredients(updatedDislikedIngredients);
  };

  return (
    <div className='disliked-ingredients-section'>
      <h2>Ingredientele Nepreferate</h2>
      <p>Selectează din ingredientele de mai jos pentru a personaliza recomandările de rețete.</p>

      <div className="disliked-ingredients-container">
        {dislikedIngredients.map(ingredientId => {
          const ingredient = allIngredients.find(i => i.id === ingredientId);
          if (!ingredient) return null;
          return (
            <div key={ingredient.id} className="disliked-ingredient" onClick={() => handleRemoveDislikedIngredient(ingredient.id)}>
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
              className={`ingredient ${dislikedIngredients.includes(ingredient.id) ? 'selected' : ''}`}
              onClick={() => handleIngredientClick(ingredient.id)}
            >
              <div className='ingredient-elements'>
                <span>{ingredient.nume_ingredient}</span>
              </div>
            </div>
          ))}
        </div>
        <button className='add-all-ingredients-button' onClick={handleAddAllIngredientsClick}>
          Adaugă Toate Ingredientele Nepreferate
        </button>
      </div>
    </div>
  );
};


export default IngredienteNedorite;