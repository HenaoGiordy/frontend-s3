import { useState } from 'react'
import Chatbot from './Chatbot'
import './Chatbot.css'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {isOpen && (
        <div className="floating-chat-window">
          <Chatbot onClose={() => setIsOpen(false)} />
        </div>
      )}

      <button
        type="button"
        className="floating-chat-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir Asistente IA"
      >
        <span style={{ fontSize: '1.25rem' }}>💬</span>
        <span>{isOpen ? 'Cerrar Chat' : 'Chatbot IA'}</span>
      </button>
    </>
  )
}
