import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginView } from './views/public/auth/LoginView';
import { MyCoursesView } from './views/student/my-courses/MyCoursesView';
import { SimplifiedCourseView } from './views/student/simplified-course/SimplifiedCourseView';
import { NotificationsView } from './views/shared/notifications/NotificationsView';
import { MessagingView } from './views/messaging/MessagingView';
import { ProfileView } from './views/account/profile/ProfileView';
import { Footer, ThemeProvider } from 'tup-arcade-ui';

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/my-courses" replace />} />
        <Route path="/login" element={<LoginView />} />
        <Route
          path="/my-courses"
          element={
            <>
              <MyCoursesView
                onNavigateMode={(courseId, mode) => {
                  if (mode === 'simplificado') {
                    navigate(`/course/${courseId}/simplified`);
                  }
                }}
                onLogout={() => navigate('/login')}
                onNavigateMessages={() => navigate('/messages')}
                onNavigateNotifications={() => navigate('/notifications')}
                onNavigateProfile={() => navigate('/profile')}
              />
              <Footer />
            </>
          }
        />
        <Route
          path="/course/:courseId/simplified"
          element={
            <>
              <SimplifiedCourseView
                onBackToCourses={() => navigate('/my-courses')}
                onLogout={() => navigate('/login')}
                onNavigateMessages={() => navigate('/messages')}
                onNavigateNotifications={() => navigate('/notifications')}
                onNavigateProfile={() => navigate('/profile')}
              />
              <Footer />
            </>
          }
        />
        <Route path="/notifications" element={<><NotificationsView /><Footer /></>} />
        <Route path="/messages" element={<MessagingView />} />
        <Route path="/profile" element={<><ProfileView /><Footer /></>} />
        <Route path="*" element={<Navigate to="/my-courses" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

