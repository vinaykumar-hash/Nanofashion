import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import './App.css'
import SetupProfile from './pages/SetupPage.jsx'
function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/setup" element={<SetupProfile />} />
    </Routes>
  )
}

export default App