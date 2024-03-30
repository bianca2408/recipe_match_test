import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';


import { BrowserRouter , Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';

import Login from './pages/Login'

import Profile from './pages/profile';
import  Chat  from './pages/Cards';




ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route index path='/' element={<Login />}></Route>
      <Route index path='/home' element={<Home />}></Route>
      <Route index path='/chat' element={<Chat />}></Route>
      
      <Route index path='/profile' element={<Profile />}></Route>
     
     


    </Routes>
   </BrowserRouter>,
  document.getElementById('root')
);


