import { StacheElement } from "//unpkg.com/can@pre/core.mjs";

import "../Stilizare/Card.css";
import { arrayUnion, collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { database } from '../firebase';

const userUid = localStorage.getItem("userUid");
async function fetchDataFromFirestore(){
    const querySnapshot = await getDocs(collection(database, "retete_utilizator"));
    const data =[];
    querySnapshot.forEach((doc) => {
        const cardData = doc.data();
        if (cardData.utilizator !== userUid) { // Excludem cardurile ale utilizatorului curent
          data.push({ id: doc.id, ...cardData });
      }
    });
    return data;
    }
    class EvilTinder extends StacheElement {
      static view = `
        <div class="header"></div>
        <div class="result {{# if(this.liking) }}liking{{/ if }}
                           {{# if(this.noping) }}noping{{/ if }}"></div>
        <div class="images">
          <div class="current" style="left: {{ this.howFarWeHaveMoved }}px">
            <img
              alt="Current Card Image"
              src="{{ this.currentCard.img }}"
              draggable="false"
            >
          </div>
          <div class="next">
            <img alt="Next Card Image" src="{{ this.nextCard.img }}">
          </div>
        </div>
    
        <div class="footer">
          <button class="dissBtn" on:click="this.nope()">Dislike</button>
          <button class="infoBtn" on:click="this.info()">Info</button>
          <button class="likeBtn" on:click="this.like()">Like</button>
        </div>
        <div class="popup_info {{ this.popupVisible ? 'true' : 'false' }}">
        <div class="popup-content">
          <h2>{{ this.currentCard.title }}</h2>
          <p>{{ this.currentCard.description }}</p>
          <h3>Ingrediente:</h3>
    <ul>
      {{# each this.currentCard.ingredients }}
        <li>{{ this }}</li>
      {{/ each }}
    </ul>
    
    <h3>Instrucțiuni:</h3>
    <ol>
      {{# each this.currentCard.instructions }}
        <li>{{ this }}</li>
      {{/ each }}
    </ol>
          <button class="closeBtn" on:click="this.togglePopup()">Close</button>
        </div>
      </div>
      
      
      `;
    
      static props = {
        popupVisible: { type: Boolean, default: false },
        howFarWeHaveMoved: Number,
        emptyCard: {
          get default() {
            return {
              img: "https://stickwix.com/wp-content/uploads/2016/12/Stop-Sign-NH.jpg",
            };
          },
        },
        cards: {
          get default() {
            return [];
          },
        },
        get currentCard() {
          return this.cards[0] || this.emptyCard;
        },
        get nextCard() {
          return this.cards[1] || this.emptyCard;
        },
        get liking() {
          return this.howFarWeHaveMoved >= 100;
        },
        get noping() {
          return this.howFarWeHaveMoved <= -100;
        },
      };
    
      like() {
        console.log("LIKED");
        this.removeCard();
        
        // Obține referința către documentul utilizatorului curent
        const userDocRef = doc(database, "utilizatori", userUid);
    
        // Actualizează câmpul 'favorite' al documentului utilizatorului curent
        // pentru a adăuga ID-ul retetei respective
        const recipeId = this.currentCard.id;
        
        // Citeste documentul utilizatorului pentru a obține datele existente
        getDoc(userDocRef).then((doc) => {
            if (doc.exists()) {
                const userData = doc.data();
    
                // Obține array-ul existent 'favorite' sau creează un array gol dacă nu există
                const favoriteArray = userData.favorite || [];
    
                // Adaugă ID-ul retetei în array-ul 'favorite'
                favoriteArray.push(recipeId);
    
                // Actualizează întregul document cu noul array 'favorite', păstrând restul câmpurilor intacte
                return setDoc(userDocRef, { ...userData, favorite: favoriteArray });
            } else {
                console.log("Documentul utilizatorului nu există!");
            }
        }).catch((error) => {
            console.error("Eroare la citirea documentului utilizatorului:", error);
        });
    }
    info() {
      console.log("info")
      this.togglePopup();
      
    }
    
    
      nope() {
        console.log("NOPED");
        this.removeCard();
      }

      togglePopup() {
        console.log("Metoda togglePopup() este apelată.");
        this.popupVisible = !this.popupVisible;
        console.log("Starea popupVisible este:", this.popupVisible);
        
      }
      
      
      removeCard() {
        const updatedCards = [...this.cards];
        updatedCards.shift(); // Eliminăm prima imagine din array
        this.cards = updatedCards;
      }
    
      async connected() {
        const data = await fetchDataFromFirestore();
        this.cards = data.map((card) => ({
          img: card.imagine,
          id: card.id,
          title: card.titlu,
          description: card.descriere,
          ingredients: card.ingrediente, 
          instructions: card.instructiuni 
        }));
    
        var current = this.querySelector(".current");
        var startingX;
    
        this.listenTo(current, "pointerdown", (event) => {
          startingX = event.clientX;
    
          this.listenTo(document, "pointermove", (event) => {
            this.howFarWeHaveMoved = event.clientX - startingX;
          });
    
          this.listenTo(document, "pointerup", (event) => {
            this.howFarWeHaveMoved = event.clientX - startingX;
    
            if (this.liking) {
              this.like();
            } else if (this.noping) {
              this.nope();
            }
    
            this.howFarWeHaveMoved = 0;
            this.stopListening(document);
          });
        });
         
          
      }
    }
    
    customElements.define("evil-tinder", EvilTinder);
    
