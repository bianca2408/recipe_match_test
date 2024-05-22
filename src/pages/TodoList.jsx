import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { database } from '../firebase';
import Test from './filters.jsx';
import RecipeList from '../components/RecipeList.jsx';

async function fetchRecipesFromFirestore(selectedIngredients) {
  if (selectedIngredients.length === 0) {
    console.log("No ingredients selected, returning empty array");
    return []; // Returnează un array gol dacă nu sunt selectate ingrediente
  }

  const selectedIngredientIds = selectedIngredients.map(ingredient => ingredient.id);
  console.log("Selected ingredient IDs:", selectedIngredientIds);

  const recipesQuery = query(
    collection(database, "retete_utilizator"),
    where("ingrediente", "array-contains-any", selectedIngredientIds)
  );

  const querySnapshot = await getDocs(recipesQuery);
  const recipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log("Fetched recipes:", recipes);
  return recipes;
}

export default function App() {
  const [ingrediente, setIngrediente] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      const recipesData = await fetchRecipesFromFirestore(selectedIngredients);
      console.log("Setting recipes:", recipesData);
      setRecipes(recipesData);
    }
    
    fetchRecipes();
  }, [selectedIngredients]);

  return (
    <div>
      <Test 
        setSelectedIngredients={setSelectedIngredients} 
        selectedIngredients={selectedIngredients}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        setIngrediente={setIngrediente}
        ingrediente={ingrediente}
      />
      <RecipeList recipes={recipes} />
    </div>
  );
}
