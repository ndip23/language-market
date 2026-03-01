import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherProfile from './pages/TeacherProfile';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import StudentLayout from './layouts/StudentLayout';
import Overview from './pages/student/Overview';
import Lessons from './pages/student/Lessons';
import SavedTutors from './pages/student/SavedTutors';
import Messages from './pages/student/Messages';
import Settings from './pages/student/Settings';
import { Toaster } from 'react-hot-toast';
import TeacherLayout from './layouts/TeacherLayout';
import TeacherOverview from './pages/teacher/Dashboard';
import ProfileBuilder from './pages/teacher/ProfileBuilder';

// 1. Create a "Public Layout" wrapper to show Navbar & Footer
const PublicLayout = () => (
  <>
    <Navbar />
    <main className="min-h-screen">
      <Outlet /> {/* This is where Home, Login, etc. will render */}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-center" />

        <Routes>
          {/* --- PUBLIC ROUTES (With Navbar & Footer) --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/teacher/:id" element={<TeacherProfile />} />
          </Route>

          {/* --- STUDENT DASHBOARD (No Navbar, Has Sidebar) --- */}
          <Route path="/dashboard/student" element={<StudentLayout />}>
            <Route index element={<Overview />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="saved" element={<SavedTutors />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* --- OTHER PRIVATE ROUTES --- */}
          <Route path="/dashboard/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherOverview />} />
            <Route path="profile" element={<ProfileBuilder />} />
            <Route path="students" element={<Lessons />} /> {/* Reuse your lessons logic */}
            <Route path="subscription" element={<Pricing />} /> {/* Reuse pricing or custom sub page */}
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/admin" element={<AdminDashboard />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;