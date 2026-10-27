import { useState, useRef, useEffect } from 'react'
import { sendChatMessage, DEFAULT_CHAT_ENDPOINT } from '../../api'
import './Chatbot.css'

const SUGGESTIONS = [
  '¿Cómo emito mi primera factura electrónica?',
  '¿Cuáles son los planes y precios disponibles?',
  '¿Qué requisitos necesito para empezar?',
  '¿Cómo se conecta Facturia con mi sistema contable?',
]

let msgCounter = 0
const getUniqueId = () => {
  msgCounter += 1
  return `msg-${msgCounter}`
}

export default function Chatbot({ isFullscreen = false, onClose = null }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: '¡Hola! 👋 Soy el asistente virtual de Facturia impulsado por IA Generativa. ¿En qué te puedo ayudar hoy?',
      time: '08:00',
    },
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [endpoint, setEndpoint] = useState(() => {
    return localStorage.getItem('chat_api_endpoint') || DEFAULT_CHAT_ENDPOINT
  })
  const [mockMode, setMockMode] = useState(() => {
    return localStorage.getItem('chat_mock_mode') === 'true'
  })
  const [showConfig, setShowConfig] = useState(false)
  const [tempEndpoint, setTempEndpoint] = useState(endpoint)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim()
    if (!text || loading) return

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const userMessage = {
      id: getUniqueId(),
      role: 'user',
      text,
      time: timeStr,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setError('')
    setLoading(true)

    // Formatear historial para el modelo
    const history = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.role,
        content: m.text,
      }))

    try {
      const response = await sendChatMessage({
        message: text,
        history,
        endpointUrl: endpoint,
        mockMode,
      })

      const botMessage = {
        id: getUniqueId(),
        role: 'assistant',
        text: response.reply || 'No recibí respuesta del modelo.',
        time: timeStr,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error('Error al consultar el chatbot:', err)
      setError(err.message || 'Error al comunicarse con el modelo de IA.')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClear = () => {
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    setMessages([
      {
        id: getUniqueId(),
        role: 'assistant',
        text: '¡Conversación reiniciada! ¿Qué te gustaría consultar ahora?',
        time: timeStr,
      },
    ])
    setError('')
  }

  const saveConfig = () => {
    setEndpoint(tempEndpoint)
    localStorage.setItem('chat_api_endpoint', tempEndpoint)
    localStorage.setItem('chat_mock_mode', String(mockMode))
    setShowConfig(false)
  }

  return (
    <div className={`chatbot-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <div className="bot-avatar">
            ✨
            <span className="online-dot" />
          </div>
          <div className="bot-info">
            <h3>
              Facturia AI
              <span className="bot-badge">Lambda + GenAI</span>
            </h3>
            <p className="bot-subtitle">Respuestas inteligentes en tiempo real</p>
          </div>
        </div>

        <div className="chatbot-header-actions">
          <button
            type="button"
            className="header-btn"
            onClick={() => {
              setTempEndpoint(endpoint)
              setShowConfig(true)
            }}
            title="Configurar endpoint de API Gateway"
          >
            ⚙️ Endpoint
          </button>
          <button
            type="button"
            className="header-btn"
            onClick={handleClear}
            title="Limpiar chat"
          >
            🗑️ Limpiar
          </button>
          {onClose && (
            <button
              type="button"
              className="header-btn"
              onClick={onClose}
              title="Cerrar ventana"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Endpoint status banner */}
      <div className="config-banner">
        <div className="config-banner-left">
          <span className={`status-pill ${mockMode ? 'mock' : 'connected'}`}>
            {mockMode
              ? 'Modo Simulación'
              : endpoint.startsWith('/')
              ? 'Reverse Proxy CloudFront'
              : 'Directo API Gateway'}
          </span>
          <span className="endpoint-text" title={endpoint}>
            {mockMode ? 'Respuestas simuladas' : endpoint}
          </span>
        </div>
        <button
          type="button"
          className="config-btn-link"
          onClick={() => {
            setTempEndpoint(endpoint)
            setShowConfig(true)
          }}
        >
          Cambiar
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-row ${msg.role === 'user' ? 'user' : 'bot'}`}
          >
            <div className="msg-avatar">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="msg-bubble">
              <div className="msg-text">{msg.text}</div>
              <div className="msg-time">{msg.time}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-row bot">
            <div className="msg-avatar">🤖</div>
            <div className="msg-bubble">
              <div className="typing-dots">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              fontSize: '0.85rem',
              border: '1px solid #fecaca',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <strong>⚠️ Error de conexión:</strong>
            <span>{error}</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => {
                  setMockMode(true)
                  localStorage.setItem('chat_mock_mode', 'true')
                  setError('')
                }}
                style={{
                  background: '#991b1b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                Activar Modo Simulación
              </button>
              <button
                type="button"
                onClick={() => setShowConfig(true)}
                style={{
                  background: 'transparent',
                  color: '#991b1b',
                  border: '1px solid #991b1b',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                Revisar URL Endpoint
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips */}
      {messages.length <= 2 && (
        <div className="suggested-prompts">
          {SUGGESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              className="prompt-pill"
              onClick={() => handleSend(item)}
            >
              💡 {item}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="chat-input-bar">
        <form
          className="input-form"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Escribe tu mensaje aquí..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() || loading}
            title="Enviar mensaje"
          >
            ➤
          </button>
        </form>
        <div className="input-hint">
          Presiona Enter para enviar • Conectado a AWS Lambda & API Gateway
        </div>
      </div>

      {/* Endpoint Configuration Modal */}
      {showConfig && (
        <div className="modal-overlay" onClick={() => setShowConfig(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Configuración de Endpoint</h3>
            <p className="modal-description">
              <strong>Arquitectura recomendada:</strong> Usa una ruta relativa como <code>/api/chat</code>. 
              En producción, CloudFront actúa como Reverse Proxy hacia API Gateway (mismo dominio, cero costo, sin errores CORS).
            </p>

            <div className="config-field">
              <label htmlFor="endpoint-input">Ruta o URL del Endpoint (POST):</label>
              <input
                id="endpoint-input"
                type="text"
                className="config-input"
                value={tempEndpoint}
                onChange={(e) => setTempEndpoint(e.target.value)}
                placeholder="/api/chat"
              />
              <button
                type="button"
                onClick={() => setTempEndpoint('/api/chat')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  padding: '4px 0',
                  marginTop: '4px',
                  display: 'block',
                }}
              >
                ↺ Restaurar ruta relativa por defecto (/api/chat)
              </button>
            </div>

            <div className="config-field" style={{ marginTop: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={mockMode}
                  onChange={(e) => setMockMode(e.target.checked)}
                />
                <span>Habilitar Modo Simulación (responder sin llamar a AWS)</span>
              </label>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                Prueba la interfaz y las respuestas del bot sin consumir recursos ni desplegar nada en AWS.
              </p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowConfig(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveConfig}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
