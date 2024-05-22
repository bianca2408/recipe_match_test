import React, { useEffect } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../firebase';

async function fetchDataFromFirestore() {
  const querySnapshot = await getDocs(collection(database, "ingrediente"));
  const data = [];
  querySnapshot.forEach((doc) => {
    const ingredienteData = doc.data();
    data.push({ id: doc.id, ...ingredienteData });
  });
  return data;
}

export default function Test({ setSelectedIngredients, selectedIngredients, setSearchTerm, searchTerm, setIngrediente, ingrediente }) {
  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataFromFirestore();
      console.log("Fetched ingredients:", data);
      setIngrediente(data);
    }
    fetchData();
  }, [setIngrediente]);

  function removeDiacritics(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function handleSearch(event) {
    setSearchTerm(removeDiacritics(event.target.value));
  }

  const filteredIngredients = ingrediente.filter(ingredient =>
    removeDiacritics(ingredient.nume_ingredient.toLowerCase()).includes(removeDiacritics(searchTerm.toLowerCase()))
  );

  function handleCheckboxChange(ingredient, checked) {
    if (checked) {
      setSelectedIngredients(prevSelectedIngredients => [...prevSelectedIngredients, ingredient]);
    } else {
      setSelectedIngredients(prevSelectedIngredients =>
        prevSelectedIngredients.filter(selectedIngredient => selectedIngredient.id !== ingredient.id)
      );
    }
  }

  return (
    <div>
      <div className="checkbox-wrapper-65">
        <h2 className="checkbox-title">Ingrediente</h2>
        <div className="search-box">
          <box-icon name='search' class="icon"></box-icon>
          <input type="text" placeholder="Caută ingrediente..." value={searchTerm} onChange={handleSearch} />
        </div>
        {filteredIngredients.map((ingredient) => (
          <label htmlFor={`cbk-${ingredient.id}`} key={ingredient.id}>
            <input
              type="checkbox"
              id={`cbk-${ingredient.id}`}
              onChange={(e) => handleCheckboxChange(ingredient, e.target.checked)}
              checked={selectedIngredients.some(selIng => selIng.id === ingredient.id)}
            />
            <span className="cbx">
              <svg width="12px" height="11px" viewBox="0 0 12 11">
                <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
              </svg>
            </span>
            <span>{ingredient.nume_ingredient}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
