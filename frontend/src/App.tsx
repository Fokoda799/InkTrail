import { Route, Routes } from 'react-router-dom'
import Header from './components/Header';
import Login from './pages/login';
import Register from './pages/register';
import Blogs from './pages/Blogs';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </>
  )
}

export default App;
