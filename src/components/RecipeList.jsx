import React, { useState } from 'react';

export default function RecipeList({ recipes }) {
  const [viewingRecipes, setViewingRecipes] = useState({});

  const handleView = (id) => {
    setViewingRecipes(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  // Verificăm dacă există rețete și dacă au fost selectate cel puțin un ingredient
  const hasRecipes = recipes.length > 0;
  const hasSelectedIngredients = Object.keys(viewingRecipes).length > 0;

  return (
    <div className="recipes">
      {hasRecipes ? (
        recipes.map(recipe => (
          <div className="recipe" key={recipe.id}>
            {recipe.imagine && <img src={recipe.imagine} alt={`Imagine pentru ${recipe.titlu}`} />}
            <h3>{recipe.titlu}</h3>
            {viewingRecipes[recipe.id] && (
              <div>
                <h4>Descriere</h4>
                <p dangerouslySetInnerHTML={{ __html: recipe.descriere }}></p>
                <h4>Ingrediente</h4>
                <ul>
                  {recipe.ingrediente.map((ingredient, i) => (
                    <li key={i}>{ingredient.ingredientName} - {ingredient.quantity}</li>
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
              <button onClick={() => handleView(recipe.id)}>
                Vezi {viewingRecipes[recipe.id] ? 'mai puțin' : 'mai mult'}
              </button>
            </div>
          </div>
        ))
      ) : (
        // Afișăm mesajul sugestiv doar dacă există cel puțin un ingredient selectat
        hasSelectedIngredients && <p>Nu există rețete disponibile pentru ingredientele selectate.</p>
      )}
    </div>
  );
}
