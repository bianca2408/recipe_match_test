import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';



import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Home from './pages/home';

import Login from './pages/Login'

import Profile from './pages/profile';
import  Chats  from './pages/ChatRooms';
import Favorite from './pages/favorite';
import Setari from './pages/Setari';
import Frigider from './pages/Frigider.jsx'

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route index path='/' element={<Login />}></Route>
      <Route index path='/home' element={<Home />}></Route>
      <Route index path='/favorite' element={<Favorite />}></Route>
      <Route index path='/chat' element={<Chats />}></Route>
      <Route index path='/profile' element={<Profile />}></Route>
      <Route index path='/setari' element={<Setari />}></Route>
      <Route index path='/frigider' element={<Frigider />}></Route>


    </Routes>
   </BrowserRouter>,
  document.getElementById('root')
);


