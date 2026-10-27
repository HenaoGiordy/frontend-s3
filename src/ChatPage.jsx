import { Link } from 'react-router-dom'
import Chatbot from './components/Chatbot/Chatbot'
import './Landing.css'

export default function ChatPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      <header className="landing-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="landing-container header-inner" style={{ padding: '12px 24px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="brand">
              <span className="brand-mark">F</span>
              <span className="brand-name">Facturia</span>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Asistente de IA Generativa
            </span>
            <Link to="/" className="btn btn-ghost" style={{ fontSize: '0.88rem' }}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: '24px 16px', display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}>
        <div style={{ width: '100%', maxWidth: '960px', height: 'calc(100vh - 120px)' }}>
          <Chatbot isFullscreen={true} />
        </div>
      </main>
    </div>
  )
}
