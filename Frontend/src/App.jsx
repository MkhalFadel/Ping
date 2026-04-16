import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ChatPage from './pages/chat/chatPage/ChatPage'
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/signup/SignupPage';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/chat' element={<ProtectedRoute>
                                        <ChatPage />
                                      </ProtectedRoute> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
