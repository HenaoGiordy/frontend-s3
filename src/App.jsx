import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Landing'
import Login from './Login'
import ChatPage from './ChatPage'
import ChatWidget from './components/Chatbot/ChatWidget'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
      <ChatWidget />
    </BrowserRouter>
  )
}

export default App

