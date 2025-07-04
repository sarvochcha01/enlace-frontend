import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import ContentOutlet from "./components/pages/ContentOutlet.tsx";
import Login from "./components/pages/auth/Login.tsx";
import Signup from "./components/pages/auth/Signup.tsx";
import Settings from "./components/pages/settings/Settings.tsx";
import Dashboard from "./components/pages/dashboard/Dashboard.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { useAuth } from "./hooks/auth/useAuth.ts";
import ProjectList from "./components/pages/project/ProjectList.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import ProjectDetails from "./components/pages/project/ProjectDetails.tsx";
import { TaskModalProvider } from "./context/TaskModalContext.tsx";
import { ProjectProvider } from "./context/ProjectContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";

import ProjectSettings from "./components/pages/project/ProjectSettings.tsx";
import Project from "./components/pages/project/Project.tsx";
import NotFound404 from "./components/pages/status/NotFound404.tsx";
import Health from "./components/pages/status/Health.tsx";
import Notifications from "./components/pages/Notifications.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";
import TaskDetails from "./components/pages/tasks/TaskDetails.tsx";
import { PopupProvider } from "./context/PopupContext.tsx";
import Loading from "./components/atoms/Loading.tsx";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<NotFound404 />}>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />

      <Route
        element={
          <ProtectedRoute>
            <ContentOutlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<Outlet />}>
          <Route index element={<ProjectList />} />
          <Route
            path=":projectId"
            element={
              <ProjectProvider>
                <TaskModalProvider>
                  <Project />
                </TaskModalProvider>
              </ProjectProvider>
            }
          >
            <Route path="" element={<ProjectDetails />}>
              <Route path="tasks/:taskId" element={<TaskDetails />} />
            </Route>
            <Route path="settings" element={<ProjectSettings />} />
          </Route>
        </Route>
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="health" element={<Health />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <ToastProvider>
          <PopupProvider>
            <UserProvider>
              <RouterProvider router={router} />
            </UserProvider>
          </PopupProvider>
        </ToastProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>
);
