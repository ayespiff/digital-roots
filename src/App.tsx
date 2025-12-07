// import WelcomeScreen from "./components/WelcomeScreen";

// export default function App() {
//   return (
//     <WelcomeScreen
//       onContinue={({ lang }) => {
//         // wire this to your router later
//         console.log("continue with language:", lang);
//       }}
//     />
//   );
// }
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shell from "./Shell";
import WelcomePage from "./pages/WelcomePage";
import LearnPage from "./pages/LearnPage";
import ProgressPage from "./pages/ProgressPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<WelcomePage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
