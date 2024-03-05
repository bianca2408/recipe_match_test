// import React, { useEffect } from 'react'
// import { Link } from 'react-router-dom';
// import logo from '../assets/logo.png'
// export default function Sidebar() {
//     useEffect(() => {
//         const body = document.querySelector("body"),
//           sidebar = body.querySelector(".sidebar"),
//           toggle = body.querySelector(".toggle"),
//           searchBtn = body.querySelector(".search-box"),
//           modeSwitch = body.querySelector(".toggle-switch"),
//           modeText = body.querySelector(".mode-text");
    
//         toggle.addEventListener("click", () => {
//           sidebar.classList.toggle("close");
//         });
    
//         searchBtn.addEventListener("click", () => {
//           sidebar.classList.remove("close");
//         });
    
//         modeSwitch.addEventListener("click", () => {
//           body.classList.toggle("dark");
//           if (body.classList.contains("dark")) {
//             modeText.innerText = "Luminos";
//           } else {
//             modeText.innerText = "Intunecat";
//           }
//         });
    
//         // Cleanup (remove the event listeners) when the component unmounts
//         return () => {
//           toggle.removeEventListener("click", () => {
//             sidebar.classList.toggle("close");
//           });
    
//           searchBtn.removeEventListener("click", () => {
//             sidebar.classList.remove("close");
//           });
    
//           modeSwitch.removeEventListener("click", () => {
//             body.classList.toggle("dark");
//             if (body.classList.contains("dark")) {
//               modeText.innerText = "Luminos";
//             } else {
//               modeText.innerText = "Intunecat";
//             }
//           });
//         };

     
//       }, []); // Empty dependency array ensures that the effect runs once after the initial render
      
      
  
//     return (
//     <div>
//          <nav className="sidebar close">
//             <header>
//                 <div className="image-text">
//                     <span className="image">
//                         <img src={logo} alt="logo" />
//                     </span>
//                     <div class="text header-text">
//                         <span className="name">RecipeMatch</span>

//                     </div>
//                 </div>
//                 <box-icon name='chevron-right' class="chevron-right toggle"></box-icon>
//             </header>
//             <div className="menu-bar">
//                 <div className="menu">
//                 <li className="search-box">
                            
//                                 <box-icon name='search' class="icon"></box-icon>
//                                 <input type="text" placeholder="Cauta..."/> 
                            
//                         </li>
//                     <ul className="menu-links">
//                         <li className="nav-link">
//                         <Link to='/profile'>
//                                 <box-icon name='food-menu' class="icon"></box-icon>
//                                 <span className="text nav-text">
//                                     Retete
//                                 </span>
//                             </Link>
//                         </li>
//                         <li className="nav-link">
//                         <Link to='/profile'>
//                                 <box-icon name='food-menu' class="icon"></box-icon>
//                                 <span className="text nav-text">
//                                     Grupuri
//                                 </span>
//                             </Link>
//                         </li>
//                         <li className="nav-link">
//                         <Link to='/profile'>
//                                 <box-icon name='food-menu' class="icon"></box-icon>
//                                 <span className="text nav-text">
//                                     Favorite
//                                 </span>
//                             </Link>
//                         </li>
//                         <li className="nav-link">
//                         <Link to='/profile'>
//                                 <box-icon name='food-menu' class="icon"></box-icon>
//                                 <span className="text nav-text">
//                                     Frigider
//                                 </span>
//                             </Link>
//                         </li>
//                         <li className="nav-link">
//                         <Link to='/profile'>
//                                 <box-icon name='food-menu' class="icon"></box-icon>
//                                 <span className="text nav-text">
//                                     Setari
//                                 </span>
//                             </Link>
//                         </li>
//                     </ul>
//                     </div>
//                     <div className="bottom-content">
//                     <li className="">
//                     <Link to='/profile'>

                            

//                             {/* <box-icon onClick={handleLogOut} name='log-out' class="icon"></box-icon>

//                                 <span onClick={handleLogOut} className="text nav-text">
//                                     Deconectare
//                                 </span> */}
//                             </Link>
//                         </li>
//                         <li className="mode">
                            
//                            <div className="moon-sun">
//                            <box-icon type='solid' name='moon' class="i moon"></box-icon>
//                            <box-icon type='solid' name='sun' class="i sun"></box-icon>
//                            </div>
//                             <span className="mode-text text">Intunecat</span>    
//                            <div className="toggle-switch">
//                             <span className="switch"></span>
//                            </div>
//                         </li>
//                     </div>
                
//             </div>
//             </nav>
//     </div>
//   )
// }
