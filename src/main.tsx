import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import ContentOutlet from "./components/pages/ContentOutlet.tsx";
import Login from "./components/pages/auth/Login.tsx";
import AuthLoader from "./components/pages/auth/AuthLoader.ts";
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

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<div>Not Found</div>}>
      <Route path="login" element={<Login />} loader={AuthLoader} />
      <Route path="signup" element={<Signup />} loader={AuthLoader} />

      <Route
        element={
          <ProtectedRoute>
            <ContentOutlet />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="projects" element={<ProjectList />} />
        <Route
          path="projects/:projectId"
          element={
            <TaskModalProvider>
              <ProjectDetails />
            </TaskModalProvider>
          }
        />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <ProjectProvider>
          <RouterProvider router={router} />
        </ProjectProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);
