import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SignIn from './pages/SingIn'; // Fixed the spelling error
import SignUp from './pages/SingUp'; // Fixed the spelling error
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';
import About from './pages/About';
import Settings from './pages/Settings'; // Fixed the spelling error
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import AdminPage from './pages/Admin';
import BlogDetail from './pages/ReadBlog'; // Ensure the correct import
import WriteBlog from './pages/WriteBlog';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog/:username/:id" element={<BlogDetail />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/new-fact" element={<WriteBlog />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
