import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
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

async function fetchRecipesFromFirestore(selectedIngredients) {
  let recipesQuery = collection(database, "retete_utilizator");
  
  // Verificăm dacă avem ingrediente selectate înainte de a aplica filtrul
  if (selectedIngredients.length > 0) {
    recipesQuery = query(recipesQuery, where("ingrediente", "array-contains-any", selectedIngredients.map(ingredient => ingredient.id)));
  }

  const querySnapshot = await getDocs(recipesQuery);
  const recipes = [];
  querySnapshot.forEach((doc) => {
    const recipeData = doc.data();
    recipes.push({ id: doc.id, ...recipeData });
  });
  return recipes;
}

export default function Test({ handleCheckboxChange }) {
  const [ingrediente, setIngrediente] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Starea pentru termenul de căutare
  const [prevSelectedIngredients, setPrevSelectedIngredients] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataFromFirestore();
      setIngrediente(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchRecipes() {
      const recipesData = await fetchRecipesFromFirestore(selectedIngredients);
      setRecipes(recipesData);
    }
    fetchRecipes();
  }, [selectedIngredients]);

  // Funcție pentru eliminarea diacriticelor dintr-un text
  function removeDiacritics(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Funcție pentru căutarea ingredientelor
  function handleSearch(event) {
    setSearchTerm(removeDiacritics(event.target.value));
    // Salvăm starea actuală a ingredientelor selectate
    setPrevSelectedIngredients(selectedIngredients);
  }

  // Filtrăm ingredientele în funcție de termenul de căutare
  const filteredIngredients = ingrediente.filter(ingredient =>
    removeDiacritics(ingredient.id.toLowerCase()).includes(removeDiacritics(searchTerm.toLowerCase()))
  );

  // Funcție pentru gestionarea selectării/dezactivării ingredientelor
  function handleCheckboxChange(ingredient, checked) {
    if (checked) {
      setSelectedIngredients(prevSelectedIngredients => [...prevSelectedIngredients, ingredient]);
    } else {
      setSelectedIngredients(prevSelectedIngredients =>
        prevSelectedIngredients.filter(selectedIngredient => selectedIngredient.id !== ingredient.id)
      );
    }
  }

  // Restabilim starea ingredientelor selectate după căutare
  useEffect(() => {
    setSelectedIngredients(prevSelectedIngredients =>
      prevSelectedIngredients.length === 0 ? prevSelectedIngredients : prevSelectedIngredients.filter(ingredient =>
        prevSelectedIngredients.map(ing => ing.id).includes(ingredient.id)
      )
    );
  }, [searchTerm]);
  

  
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
              checked={selectedIngredients.some(selIng => selIng.id === ingredient.id)} // Verificăm dacă ingredientul este deja selectat
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

      <div>
        <h2>Rețete</h2>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>{recipe.titlu}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
