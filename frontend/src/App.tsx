import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PrivateRoute } from './components/PrivateRoute';
import { RedirectAuthenticatedUser } from './components/RedirectAuthenticatedUser';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import { useAuth } from './hooks/useAuth';

// Pages
import BlogPage from './pages/BlogPage';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import EmailVerificationPage from './pages/VerficationPage';
import About from './pages/About';
import Profile from './pages/Profile';
import WriteBlog from './pages/WriteBlog';
import ReadBlog from './pages/ReadBlog';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner';
import SearchResults from './pages/SearchResult';
import UpdateBlog from './pages/updateBlog';
import NotificationsPage from './pages/Notifications/Notifications';

function App() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const Root = () => {
    if (isAuthenticated) {
      return <Navigate to="/blogs" replace />;
    }
    return <Navigate to="/welcome" replace />;
  };

  return (
    <>
      <Header user={user} isAuthenticated={isAuthenticated} onLogout={logout} />

      <div className='mt-16 h-[calc(100vh-4rem)] overflow-y-auto scroll-container' id="scroll-container">
        <main>
          <Routes>
            {/* 🏠 Root Route */}
            <Route path="/" element={<Root />} />

            {/* 🔒 Authentication Routes (only for non-authenticated users) */}
            <Route element={<RedirectAuthenticatedUser />}>
              <Route path="/welcome" element={<LandingPage />} />
              <Route path="/signin" element={<SignIn key={location.pathname} />} />
              <Route path="/signup" element={<SignUp key={location.pathname} />} />
            </Route>

            {/* 🔐 Protected Routes (only for authenticated users) */}
            <Route element={<PrivateRoute />}>
              <Route path="/blogs" element={<BlogPage />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/new-fact" element={<WriteBlog />} />
              <Route path="/blog/:id" element={<ReadBlog />} />
              <Route path="/blog/:id/comment" element={<ReadBlog />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/edit-blog/:id" element={<UpdateBlog />} />
              <Route path="/verify-email" element={<EmailVerificationPage />} />
              <Route path="/results" element={<SearchResults />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            {/* 🌍 Public Routes (accessible to everyone) */}
            <Route path="/about" element={<About />} />

            {/* ❌ Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Toaster />
        </main>

        {!isAuthenticated && <Footer />}
      </div>
    </>
  );
}

export default App;