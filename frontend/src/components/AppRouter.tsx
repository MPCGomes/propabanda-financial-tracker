import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DashboardPerformance from "../pages/DashboardPerformance";
import Clients from "../pages/Clients";
import ClientDetails from "../pages/ClientDetails";
import ClientRegister from "../pages/ClientRegister";
import ClientEdit from "../pages/ClientEdit";
import Orders from "../pages/Orders";
import OrdersDetails from "../pages/OrdersDetails";
import OrderRegister from "../pages/OrderRegister";
import PrivateRoute from "./PrivateRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Público */}
        <Route path="/login" element={<Login />} />

        {/* Protegido */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard title={""} />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard title={""} />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/performance"
          element={
            <PrivateRoute>
              <DashboardPerformance title={""} />
            </PrivateRoute>
          }
        />

        {/* Clientes */}
        <Route
          path="/clients"
          element={
            <PrivateRoute>
              <Clients />
            </PrivateRoute>
          }
        />
        <Route
          path="/clients/register"
          element={
            <PrivateRoute>
              <ClientRegister title={""} />
            </PrivateRoute>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <PrivateRoute>
              <ClientDetails title={""} />
            </PrivateRoute>
          }
        />
        <Route
          path="/clients/:id/edit"
          element={
            <PrivateRoute>
              <ClientEdit title={""} />
            </PrivateRoute>
          }
        />

        {/* Pedidos */}
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders title={""} />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/register"
          element={
            <PrivateRoute>
              <OrderRegister title={""} />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <PrivateRoute>
              <OrdersDetails title={""} />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
