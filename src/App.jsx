import { Routes, Route } from 'react-router-dom'

import Navbar from './components/navbar'
import Home from './pages/home'
import Trafika from './pages/trafika'
import Prijevoz from './pages/prijevoz'

import Digitalne from './pages/digitalne'
import  "./App.css"


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trafika" element={<Trafika />} />
        <Route path="/prijevoz" element={<Prijevoz />} />
        <Route path="/digitalne" element={<Digitalne />} />
      </Routes>
    </>
  )
}

export default App