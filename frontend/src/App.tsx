import {BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SingIn from './pages/SingIn';
import SingUp from './pages/SingUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import About from './pages/About';
import MyAcount from './pages/MyAcount';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import AdminPage from './pages/Admin';

// import NotFound from './pages/NotFound'; // Optional: Separate NotFound component

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/signin" element={<SingIn />} />
          <Route path="/signup" element={<SingUp />} />
          <Route path="/about" element={<About />} />
          <Route element={<PrivateRoute />} >
            <Route path="/blogs" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/myaccount" element={<MyAcount />} />
          </Route>
          <Route path="*" element={<NotFound />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
