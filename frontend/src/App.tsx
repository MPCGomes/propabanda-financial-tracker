import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardPerformance from "./pages/DashboardPerformance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage title="Home Page" />} />
        <Route
          path="/placeholder1"
          element={<PlaceholderPage title="Placeholder Page" />}
        />
        <Route
          path="/login"
          element={<Login title="Login" />}
        />
        <Route
          path="/dashboard-evolution"
          element={<Dashboard title="Relatórios" />}
        />
        <Route
          path="/dashboard-performance"
          element={<DashboardPerformance title="Relatórios" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
