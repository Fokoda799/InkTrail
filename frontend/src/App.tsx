import { Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import Search from './pages/Search';
import { Toaster } from 'react-hot-toast';
import BlogsPage from './pages/BlogPage';
import RedirectAuthenticatedUser from './components/RedirectAuthenticatedUser';
import { selectUserState } from './redux/reducers/userReducer';
import About from './pages/About';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import EmailVerificationPage from './pages/VerficationPage';
import Profile from './pages/Profile';
import WriteBlog from './pages/WriteBlog';
import ReadBlog from './pages/ReadBlog';
import { useAppSelector } from './redux/hooks';
import { useEffect } from 'react';
import { checkAuth } from './actions/userAction';
import { useAppDispatch } from './redux/hooks';
import Settings from './pages/Settings';

function App() {
  const { user, isAuthenticated } = useAppSelector(selectUserState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(checkAuth());
    };
    
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <Header user={user} isAuthenticated={isAuthenticated} />
      <div>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<BlogsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new-fact" element={<WriteBlog />} />
            <Route path="/blog/:username/:id" element={<ReadBlog />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route element={<RedirectAuthenticatedUser />}>
            <Route path="/welcome" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
          </Route>
          <Route path="/about" element={<About />} />
      
          {/* catch all routes */}
          <Route path='*' element={<Navigate to='/welcome' replace />} />
        </Routes>
        <Toaster />
      </div>
      <Footer />
    </>
  );
}

export default App;