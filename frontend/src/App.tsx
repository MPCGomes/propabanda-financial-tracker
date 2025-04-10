import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardPerformance from "./pages/DashboardPerformance";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import ClientRegister from "./pages/ClientRegister";
import ClientEdit from "./pages/ClientEdit";
import Orders from "./pages/Orders";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage title="Home Page" />} />
        <Route path="/login" element={<Login title="Login" />} />
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
        <Route path="/client/:id" element={<ClientDetails title="Cliente" />} />
        <Route
          path="/client/register"
          element={<ClientRegister title="Cadastrar Cliente" />}
        />
        <Route
          path="/client/edit/:id"
          element={<ClientEdit title="Editar Cliente" />}
        />
        <Route path="/orders" element={<Orders title="Pedidos" />} />
      </Routes>
    </Router>
  );
}

export default App;
