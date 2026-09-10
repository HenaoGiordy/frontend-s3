import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { createUser } from './api'
import './Login.css'

const VALID_EMAIL = 'admin@demo.com'
const VALID_PASSWORD = '123456'

function Login() {
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  const switchMode = (next) => {
    setMode(next)
    setError('')
    setSuccess('')
  }

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

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Completa el correo electrónico')
      return
    }

    setSubmitting(true)
    try {
      await createUser({ email, name })
      setSuccess('Cuenta creada. Ya puedes iniciar sesión.')
      setEmail('')
      setName('')
      setMode('login')
    } catch (err) {
      if (err.status === 409) {
        setError('Ya existe una cuenta con ese correo')
      } else {
        setError('No se pudo crear la cuenta. Intenta de nuevo.')
      }
    } finally {
      setSubmitting(false)
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

  if (mode === 'signup') {
    return (
      <div className="login-container">
        <form className="login-card" onSubmit={handleSignup}>
          <Link to="/" className="login-brand">
            <span className="brand-mark">F</span>
            <span className="brand-name">Facturia</span>
          </Link>
          <h1>Crear cuenta</h1>
          <p className="login-subtitle">Regístrate para empezar a facturar</p>

          <label htmlFor="signup-name">Nombre</label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
          />

          <label htmlFor="signup-email">Correo electrónico</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Creando...' : 'Crear cuenta'}
          </button>

          <p className="hint">
            ¿Ya tienes cuenta?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); switchMode('login') }}>
              Inicia sesión
            </a>
          </p>
          <Link to="/" className="back-link">← Volver al inicio</Link>
        </form>
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

        {success && <p className="hint" style={{ color: '#16a34a' }}>{success}</p>}
        {error && <p className="error">{error}</p>}

        <button type="submit">Ingresar</button>

        <p className="hint">Prueba con: {VALID_EMAIL} / {VALID_PASSWORD}</p>
        <p className="hint">
          ¿No tienes cuenta?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); switchMode('signup') }}>
            Crear cuenta
          </a>
        </p>
        <Link to="/" className="back-link">← Volver al inicio</Link>
      </form>
    </div>
  )
}

export default Login
