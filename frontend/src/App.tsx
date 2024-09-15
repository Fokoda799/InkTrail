import {BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SingIn from './pages/SingIn';
import SingUp from './pages/SingUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import About from './pages/About';
import MyAcount from './pages/MyAcount';
import AdminePage from './pages/Admin';

// import NotFound from './pages/NotFound'; // Optional: Separate NotFound component

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/blogs" element={<Home />} />
          <Route path="/signin" element={<SingIn />} />
          <Route path="/signup" element={<SingUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myaccount" element={<MyAcount />} />
          <Route path="/about" element={<About />} />
          <Route path="/admine" element={<AdminePage />} />
          {/* <Route path="*" element={<NotFound />} /> */} {/* Optional: Separate NotFound component */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
