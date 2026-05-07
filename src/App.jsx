import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import CourseDetails from "./pages/CourseDetails";
import CreateCourse from "./pages/CreateCourse";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/register";
import ResetPassword from "./pages/ResetPassword";
import UserTools from "./pages/UserTools";
import VerifyEmail from "./pages/VerifyEmail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <ProtectedRoute>
            <VerifyEmail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-course"
        element={
          <ProtectedRoute>
            <CreateCourse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course/:courseId"
        element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tools"
        element={
          <ProtectedRoute>
            <UserTools />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
