import { Routes, Route } from "react-router-dom";
import { Layout } from "./layout/Layout.jsx";
import { ChallengeGenerator } from "./challenge/ChallengeGenerator.jsx";
import { HistoryPanel } from "./history/HistoryPanel.jsx";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ChallengeGenerator />} />
        <Route path="/history" element={<HistoryPanel />} />
      </Route>
    </Routes>
  );
}

export default App;
