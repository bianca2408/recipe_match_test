import { StacheElement } from "//unpkg.com/can@pre/core.mjs";

import "../Card.css";
import { collection, getDocs } from 'firebase/firestore';
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
              alt="Current Profile Image"
              src="{{ this.currentProfile.img }}"
              draggable="false"
            >
          </div>
          <div class="next">
            <img alt="Next Profile Image" src="{{ this.nextProfile.img }}">
          </div>
        </div>
    
        <div class="footer">
          <button class="dissBtn" on:click="this.nope()">Dislike</button>
          <button class="likeBtn" on:click="this.like()">Like</button>
        </div>
      `;
    
      static props = {
        howFarWeHaveMoved: Number,
        emptyProfile: {
          get default() {
            return {
              img: "https://stickwix.com/wp-content/uploads/2016/12/Stop-Sign-NH.jpg",
            };
          },
        },
        profiles: {
          get default() {
            return [];
          },
        },
        get currentProfile() {
          return this.profiles[0] || this.emptyProfile;
        },
        get nextProfile() {
          return this.profiles[1] || this.emptyProfile;
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
        
      }
    
      nope() {
        console.log("NOPED");
        this.removeCard();
        
      }
    
      removeCard() {
        const updatedProfiles = [...this.profiles];
        updatedProfiles.shift(); // Eliminăm prima imagine din array
        this.profiles = updatedProfiles;
      }
    
      async connected() {
        const data = await fetchDataFromFirestore();
        this.profiles = data.map((profile) => ({
          img: profile.imagine,
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
    