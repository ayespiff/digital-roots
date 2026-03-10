import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shell from "./Shell";
import WelcomePage from "./pages/WelcomePage";
import LearnPage from "./pages/LearnPage";
import ProgressPage from "./pages/ProgressPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useEffect } from "react";
import { me } from "./services/authAPI";
import ExplorePage from "./pages/ExplorePage";


export default function App() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    me().then((data) => {
      setUser(data.user);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell user={user} setUser={setUser} />}>
          <Route index element={<WelcomePage user={user}/>} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="learn" element={<LearnPage user={user} />} />
          <Route path="progress" element={<ProgressPage user={user} />} />
          <Route path="admin" element={<AdminPage user={user} />} />
          <Route path="login" element={<LoginPage setUser={setUser} />} />
          <Route path="register" element={<RegisterPage setUser={setUser} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
