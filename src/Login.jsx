import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

const VALID_EMAIL = 'admin@demo.com'
const VALID_PASSWORD = '123456'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      setLoggedIn(true)
    } else {
      setError('Correo o contraseña incorrectos')
    }
  }

  const handleLogout = () => {
    setLoggedIn(false)
    setEmail('')
    setPassword('')
  }

  if (loggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <Link to="/" className="login-brand">
            <span className="brand-mark">F</span>
            <span className="brand-name">Facturia</span>
          </Link>
          <h1>¡Bienvenido!</h1>
          <p>Sesión iniciada como <strong>{email}</strong></p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <Link to="/" className="login-brand">
          <span className="brand-mark">F</span>
          <span className="brand-name">Facturia</span>
        </Link>
        <h1>Iniciar sesión</h1>
        <p className="login-subtitle">Accede a tu panel de facturación electrónica</p>

        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@demo.com"
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Ingresar</button>

        <p className="hint">Prueba con: {VALID_EMAIL} / {VALID_PASSWORD}</p>
        <Link to="/" className="back-link">← Volver al inicio</Link>
      </form>
    </div>
  )
}

export default Login
