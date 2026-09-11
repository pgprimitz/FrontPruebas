import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginView } from './views/public/auth/LoginView';
import { MyCoursesView } from './views/student/my-courses/MyCoursesView';
import { SimplifiedCourseView } from './views/student/simplified-course/SimplifiedCourseView';
import { NotificationsView } from './views/shared/notifications/NotificationsView';
import { MessagingView } from './views/messaging/MessagingView';
import { ProfileView } from './views/account/profile/ProfileView';
import { Footer, ThemeProvider } from 'tup-arcade-ui';

/**
 * Every screen shares the same vertical shell: the view fills the available
 * height and the footer always sits at the bottom, so no route can forget it.
 */
function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/my-courses" replace />} />
      <Route
        path="/login"
        element={
          <PageLayout>
            <LoginView />
          </PageLayout>
        }
      />
      <Route
        path="/my-courses"
        element={
          <PageLayout>
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
          </PageLayout>
        }
      />
      <Route
        path="/course/:courseId/simplified"
        element={
          <PageLayout>
            <SimplifiedCourseView
              onBackToCourses={() => navigate('/my-courses')}
              onLogout={() => navigate('/login')}
              onNavigateMessages={() => navigate('/messages')}
              onNavigateNotifications={() => navigate('/notifications')}
              onNavigateProfile={() => navigate('/profile')}
            />
          </PageLayout>
        }
      />
      <Route
        path="/notifications"
        element={
          <PageLayout>
            <NotificationsView />
          </PageLayout>
        }
      />
      <Route
        path="/messages"
        element={
          <PageLayout>
            <MessagingView />
          </PageLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <PageLayout>
            <ProfileView />
          </PageLayout>
        }
      />
      <Route path="*" element={<Navigate to="/my-courses" replace />} />
    </Routes>
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
