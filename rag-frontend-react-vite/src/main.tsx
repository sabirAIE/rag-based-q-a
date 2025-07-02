import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ChatAPP } from "./App.tsx";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./hooks/index.tsx";
import DocumentMangement from "./views/DocumentMangement.tsx";
import LoginView from "./views/LoginView.tsx";
import SignupView from "./views/SignupView.tsx";
import LandingLayout from "./layouts/LandingLayout.tsx";
import { AuthProvider } from "./context/auth-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <MainAPP />
    </AuthProvider>
  </StrictMode>
);

export default function MainAPP() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/signup" element={<SignupView />} />
        <Route path="/" element={<Navigate to="/app/chat" />} />

        {/* Protected layout with nested child routes */}
        <Route
          path="/app"
          element={<ProtectedRoute element={<LandingLayout />} />}
        >
          <Route
            path="upload"
            element={<ProtectedRoute element={<DocumentMangement />} />}
          />
          <Route
            path="chat"
            element={<ChatAPP />} // Chat is public inside app layout
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
