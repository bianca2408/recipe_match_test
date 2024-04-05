import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, startAt, endAt } from 'firebase/firestore';
import { database } from '../firebase';

const userUid = localStorage.getItem("userUid");
async function fetchDataFromFirestore(){
    const querySnapshot = await getDocs(collection(database, "ingrediente"));
    const data =[];
    querySnapshot.forEach((doc) => {
        const ingredienteData = doc.data();
        data.push({ id: doc.id, ...ingredienteData });
    });
    return data;
}

const categories = [
  'Mic dejun',
  'Pranz',
  'Cina',
  'Gustare',
  'Desert',
  'Brunch'
];

const allProducts = [];

export default function Test() {
  const [ingrediente, setIngrediente] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 1. Adăugarea stării pentru termenul de căutare

  useEffect(() => {
      async function fetchData() {
          const data = await fetchDataFromFirestore();
          setIngrediente(data);
      }
      fetchData();
  },[]); //run once when the component loads and never again
  
 

  const [categoryFilters, setCategoryFilters] = useState(new Set());

  function updateFilters(checked, categoryFilter) {
    if (checked) {
      setCategoryFilters(prev => new Set(prev).add(categoryFilter));
    } else {
      setCategoryFilters(prev => {
        const next = new Set(prev);
        next.delete(categoryFilter);
        return next;
      });
    }
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

  return (
    <div>
      {/* Adăugarea câmpului de căutare */}
      
      <div className="checkbox-wrapper-65">
        <h2 className="checkbox-title">Ingrediente</h2>
        <div className="search-box">
        <box-icon name='search' class="icon"></box-icon>
        <input type="text" placeholder="Caută ingrediente..."
        value={searchTerm}
        onChange={handleSearch}/> 
      </div>
    
        {filteredIngredients.map((ingredient, id) => (
          <label htmlFor={`cbk-${ingredient.id}`} key={ingredient.id}>
          <input
              type="checkbox"
              id={`cbk-${ingredient.id}`}
              onChange={e => updateFilters(e.target.checked, ingredient)}
            />
            <span className="cbx">
              <svg width="12px" height="11px" viewBox="0 0 12 11">
                <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
              </svg>
            </span>
            <span>{ingredient.id}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
