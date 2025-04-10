import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardPerformance from "./pages/DashboardPerformance";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";

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
          path="/dashboard"
          element={<Dashboard title="Relatórios de Evolução" />}
        />
        <Route
          path="/dashboard-performance"
          element={<DashboardPerformance title="Relatórios de Performance" />}
        />
        <Route
          path="/clients"
          element={<Clients title="Lista dos Clientes" />}
        />
        <Route
          path="/clientsdetails"
          element={<ClientDetails title="Cliente" />}
        />

      </Routes>
    </Router>
  );
}

export default App;
