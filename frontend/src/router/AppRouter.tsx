import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { TasksPage } from "../pages/TasksPage";
import { useAuth } from "../hooks/useAuth";
export const AppRouter = () => {
  const { isAuth } = useAuth();

  return (
    <>
      <Routes>
        {isAuth ? (
          <>
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/*" element={<Navigate to="/tasks" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </>
  );
};
