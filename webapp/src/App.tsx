import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Leaders from "./pages/Leaders";
import Giveaways from "./pages/Giveaways";
import PlayPage from "./pages/play/Index";
import Game from "./pages/Game";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/game" replace />} />
          <Route path="/leaders" element={<Leaders />} />
          <Route path="/giveaways" element={<Giveaways />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/game" element={<Game />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
