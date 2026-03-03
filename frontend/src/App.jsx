import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// --- COMPONENTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// --- LAYOUTS ---
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';

// --- PUBLIC PAGES ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherProfile from './pages/TeacherProfile'; // Public View
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';

// --- STUDENT PORTAL PAGES ---
import StudentOverview from './pages/student/Overview';
import FindTutors from './pages/student/FindTutors';
import TeacherDetail from './pages/student/TeacherDetail'; // Internal View
import Lessons from './pages/student/Lessons';
import SavedTutors from './pages/student/SavedTutors';
import Messages from './pages/student/Messages';
import StudentSettings from './pages/student/Settings';
import StudentCheckOut from './pages/student/StudentCheckOut';
import StudentHowItWorks from './pages/student/StudentHowItWorks';

// --- TEACHER PORTAL PAGES ---
import TeacherOverview from './pages/teacher/Dashboard';
import TeacherStudents from './pages/teacher/Students';
import ProfileBuilder from './pages/teacher/ProfileBuilder';
import TeacherSubscription from './pages/teacher/Subscription';
import TeacherMessages from './pages/teacher/Messages';
import TeacherCheckOut from './pages/teacher/CheckOut';

// --- ADMIN ---
import AdminDashboard from './pages/AdminDashboard';

// 1. PUBLIC LAYOUT WRAPPER (Shows Navbar & Footer)
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 4000,
            style: { background: '#fff', color: '#0f172a', fontWeight: 'bold', borderRadius: '1.5rem', border: '1px solid #f1f5f9' }
          }} 
        />

        <Routes>
          {/* ==========================================
              ZONE 1: PUBLIC PAGES (Navbar + Footer)
          =========================================== */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/teacher/:id" element={<TeacherProfile />} />
          </Route>


          {/* ==========================================
              ZONE 2: STUDENT PORTAL (Sidebar)
          =========================================== */}
          <Route path="/dashboard/student" element={<StudentLayout />}>
            <Route index element={<StudentOverview />} />
            <Route path="find" element={<FindTutors />} />
            <Route path="teacher/:id" element={<TeacherDetail />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="saved" element={<SavedTutors />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<StudentSettings />} />
            <Route path="checkout" element={<StudentCheckOut />} />
            <Route path="how-it-works" element={<StudentHowItWorks />} />
          </Route>


          {/* ==========================================
              ZONE 3: TEACHER PORTAL (Sidebar)
          =========================================== */}
          <Route path="/dashboard/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherOverview />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="profile" element={<ProfileBuilder />} />
            <Route path="subscription" element={<TeacherSubscription />} />
            <Route path="checkout" element={<TeacherCheckOut />} />
            <Route path="messages" element={<TeacherMessages />} />
            <Route path="settings" element={<StudentSettings />} /> {/* Shared Settings UI */}
          </Route>


          {/* ==========================================
              ZONE 4: ADMIN & FALLBACK
          =========================================== */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Catch-all: Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;