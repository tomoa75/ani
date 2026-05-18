import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className='navigacija'>
        <Link to="/">Home</Link>

      <Link to="/trafika">Trafika</Link>

      <Link to="/prijevoz">Usluge Prijevoza</Link>

      <Link to="/digitalne">Digitalne Usluge</Link>

    </nav>
  )
}