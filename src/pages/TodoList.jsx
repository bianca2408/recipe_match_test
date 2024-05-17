// // import "../Chat.css";
// // import React, { useState, useEffect } from 'react';
// // import { collection, addDoc, getDocs } from "firebase/firestore";
// // import { database } from '../firebase';
 
// // const Todo = () => {
// //     const [todo, setTodo] = useState("");
// //     const [todos, setTodos] = useState([]);
 
// //     const addTodo = async (e) => {
// //         e.preventDefault();  
       
// //         try {
// //             const docRef = await addDoc(collection(database, "todos"), {
// //               todo: todo,    
// //             });
// //             console.log("Document written with ID: ", docRef.id);
// //           } catch (e) {
// //             console.error("Error adding document: ", e);
// //           }
// //     }
 
// //     const fetchPost = async () => {
       
// //         await getDocs(collection(database, "todos"))
// //             .then((querySnapshot)=>{              
// //                 const newData = querySnapshot.docs
// //                     .map((doc) => ({...doc.data(), id:doc.id }));
// //                 setTodos(newData);                
// //                 console.log(todos, newData);
// //             })
       
// //     }
   
// //     useEffect(()=>{
// //         fetchPost();
// //     }, [])
 
 
// //     return (
// //         <section className="todo-container">
// //             <div className="todo">
// //                 <h1 className="header">
// //                     Todo-App
// //                 </h1>
   
// //                 <div>
   
// //                     <div>
// //                         <input
// //                             type="text"
// //                             placeholder="What do you have to do today?"
// //                             onChange={(e)=>setTodo(e.target.value)}
// //                         />
// //                     </div>
   
// //                     <div className="btn-container">
// //                         <button
// //                             type="submit"
// //                             className="btn"
// //                             onClick={addTodo}
// //                         >
// //                             Submit
// //                         </button>
// //                     </div>
   
// //                 </div>
   
// //                 <div className="todo-content">
// //                     {
// //                         todos?.map((todo,i)=>(
// //                             <p key={i}>
// //                                 {todo.todo}
// //                             </p>
// //                         ))
// //                     }
// //                 </div>
// //             </div>
// //         </section>
// //     )
// // }
 
// // export default Todo
// import React, { useEffect } from 'react'; 
// import { useState } from 'react';
// import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
// import { collection, getDocs } from 'firebase/firestore';
// import { database } from '../firebase';

// const userUid = localStorage.getItem("userUid");
// async function fetchDataFromFirestore(){
//     const querySnapshot = await getDocs(collection(database, "retete_utilizator"));
//     const data =[];
//     querySnapshot.forEach((doc) => {
//         const cardData = doc.data();
//         if (cardData.utilizator !== userUid) { // Excludem cardurile ale utilizatorului curent
//             data.push({ id: doc.id, ...cardData });
//         }
//     });
//     return data;
//     }


// const Card = ({ id, image, color, title, removeCard, onSwipe }) => {
//     const motionValue = useMotionValue(0);
//     const rotateValue = useTransform(motionValue, [-200, 200], [-50, 50]);
//     const opacityValue = useTransform(motionValue, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

//     const style = {
//         backgroundImage: `url(${image})`,
//         backgroundRepeat: 'no-repeat',
//         backgroundSize: 'contain',
//         backgroundColor: color,
//         boxShadow: '5px 10px 18px #888888',
//         borderRadius: 20,
//         height: '50vh',
//         maxWidth: '85vw',
//         position: "absolute",
//         cursor: 'grab',
//         padding: '20px',
//         width: 600,
       
//     };
//     const textStyle = {
//         position: 'absolute',
//         bottom: '10px', // Ajustăm poziția textului în partea de jos
//         left: '10px', // Ajustăm poziția textului în partea stângă
//         fontSize: '20px', // Mărimea fontului
//         zIndex: 2,
//     };
//     return (
//         <div >
//             <motion.div
//                 center
//                 drag='x'
//                 x={motionValue}
//                 rotate={rotateValue}
//                 opacity={opacityValue}
//                 dragConstraints={{ left: 0, right: 0 }}
//                 style={style}
                
                
//                 onDragEnd={(event, info) => {
//                     if (Math.abs(info.offset.x) <= 150) {
//                         // Cardul nu a fost tras suficient de mult, se revine la poziția inițială
//                         removeCard();
//                     } else {
//                         // Cardul a fost tras suficient de mult, se elimină
//                         const direction = info.offset.x < 0 ? 'left' : 'right'; // Aici corectăm direcția în funcție de coordonata x
//                         onSwipe(direction, id);
//                     }
//                 }}
//                 transition={{ ease: 'easeOut', duration: 0.5 }}// Adăugăm tranzitia pentru proprietatea opacity
//             />  
//             <div style={textStyle}>{title}</div> 
//         </div>
//     );
// };

// const Cards = () => {
//     const [cards, setCards] = useState([]);

//     useEffect(() => {
//         async function fetchData() {
//             const data = await fetchDataFromFirestore();
//             setCards(data);
//         }
//         fetchData();
//     },[]); //run once when the component loads and never again
    
//     const [cardsEnded, setCardsEnded] = useState(false);
//     const removeCard = (id) => {
//       const updatedCards = [...cards];
//       updatedCards.pop(); // Eliminăm ultimul card
//       if (updatedCards.length === 0) {
//         setCardsEnded(true); // Setăm că s-au terminat cardurile
//     }
//       setCards(updatedCards);
//   };

//   const onSwipe = (direction, id) => {
//       console.log(`Card trasa in directia: ${direction}`);
//       removeCard(id);
//   };

//   const moveLeft = () => {
//     // Mutăm cardul spre stânga
//     if (!cardsEnded) {
//         removeCard();
//         console.log('Direcția a fost schimbată la stânga');
//     }
// };

// const moveRight = () => {
//     // Mutăm cardul spre dreapta
//     if (!cardsEnded) {
//         removeCard();
//         console.log('Direcția a fost schimbată la dreapta');
//     }
// };

//   return (
//       <div className='Chat' style={{ position: 'relative', height: '700px' }}>
//            <AnimatePresence>
//           {cards.map((card, index) => (
           
//               <Card key={card.id} id={card.id} image={card.imagine} color={card.color}  title={card.titlu} removeCard={removeCard} onSwipe={onSwipe} style={{ zIndex: cards.length - index }} 
              
//               />
              
//           ))} </AnimatePresence>
//            {cardsEnded && (
//                 <div>
//                     <Card id={0}  color="#ffffff" removeCard={() => {}} onSwipe={() => {}} />
//                     <p style={{ textAlign: 'center' }}>No more cards available</p>
//                 </div>
//             )}
           
//           <button onClick={moveLeft}  style={{ position: 'absolute', top: '70%', left: '10px', transform: 'translateY(-50%)' }}>Left</button>
//           <button onClick={moveRight}  style={{ position: 'absolute', top: '70%', right: '10px', transform: 'translateY(-50%)' }}>Right</button>
//       </div>
//   );
// };

// export default Cards;

