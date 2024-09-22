import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react'; // Add lazy and Suspense for code splitting
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import { AppProvider } from '@toolpad/core';
import { useTheme } from '@emotion/react';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages to optimize performance
const SignIn = lazy(() => import('./pages/SingIn'));
const SignUp = lazy(() => import('./pages/SingUp'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Profile = lazy(() => import('./pages/Profile'));
const About = lazy(() => import('./pages/About'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminPage = lazy(() => import('./pages/Admin'));
const ReadBlog = lazy(() => import('./pages/ReadBlog'));
const WriteBlog = lazy(() => import('./pages/WriteBlog'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

function App() {
  const theme = useTheme();

  return (
    <AppProvider theme={theme}>
      <BrowserRouter>
        <Header />

        {/* Wrap Suspense with ErrorBoundary for better error handling */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}> {/* Custom loading spinner */}
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<Search />} />
              <Route path="/blog/:username/:id" element={<ReadBlog />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Grouping Private Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/new-fact" element={<WriteBlog />} />
              </Route>

              {/* Admin Route */}
              <Route path="/admin" element={<AdminPage />} />

              {/* 404 Page - Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Footer />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
