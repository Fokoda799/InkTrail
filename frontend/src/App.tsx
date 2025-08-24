import { Navigate, Route, Routes } from 'react-router-dom';
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
import SearchResults from './pages/SearchResult';
import UpdateBlog from './pages/updateBlog';
import NotificationsPage from './pages/Notifications/Notifications';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ScrollToTop from './components/ScrollToTop';
import TermsOfService from './pages/ToS';
import ResetPassword from './pages/ResetPassword';

function App() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <ScrollToTop />
      <Header user={user} isAuthenticated={isAuthenticated} onLogout={logout} />

      <div className='mt-16 h-[calc(100vh-4rem)] overflow-y-auto scroll-container' id="scroll-container">
        <main>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/blogs" replace /> : <Navigate to="/welcome" replace />
            } />

            {/* Authentication routes for NOT logged-in users */}
            {!isAuthenticated && (
              <>
                <Route path="/welcome" element={<LandingPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
              </>
            )}

            {/* Protected routes for logged-in users */}
            {isAuthenticated && (
              <>
                <Route path="/blogs" element={<BlogPage />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/new-fact" element={<WriteBlog />} />
                <Route path="/blog/:id" element={<ReadBlog />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/edit-blog/:id" element={<UpdateBlog />} />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                <Route path="/results" element={<SearchResults />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </>
            )}

            {/* Public pages for everyone */}
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* <Route path="/contact-us" element={<ContactUs />} /> */}

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {!isAuthenticated && <Footer />}
      </div>
    </>
  );
}


export default App;