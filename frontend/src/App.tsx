import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {PrivateRoute } from './components/PrivateRoute';
import {RedirectAuthenticatedUser} from './components/RedirectAuthenticatedUser';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import { useAuth } from './hooks/useAuth';

// Pages
import BlogsPage from './pages/BlogPage';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import EmailVerificationPage from './pages/VerficationPage';
import About from './pages/About';
import Search from './pages/Search';
import Profile from './pages/Profile';
import WriteBlog from './pages/WriteBlog';
import ReadBlog from './pages/ReadBlog';
import EditDeleteBlog from './pages/EditDeleteBlog';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, isAuthenticated, isVerified, isLoading, logout } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Header user={user} isAuthenticated={isAuthenticated} onLogout={logout} />

      <div>
        <Routes>

          {/* 🔐 Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<BlogsPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new-fact" element={<WriteBlog />} />
            <Route path="/blog/:id" element={<ReadBlog />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/edit-blog/:id" element={<EditDeleteBlog />} />

            { !isVerified &&
              <Route path="/verify-email" element={<EmailVerificationPage />} />
            }
          </Route>

          {/* 🚫 Public-Only Routes */}
          <Route element={<RedirectAuthenticatedUser />}>
            <Route path="/welcome" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>

          {/* 🟢 Public Routes */}
          <Route path="/about" element={<About />} />

          {/* 🟥 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster />
      </div>

      {!isAuthenticated && <Footer />}
    </>
  );
}

export default App;
