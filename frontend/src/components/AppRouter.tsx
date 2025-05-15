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
import OrderEdit from "../pages/OrderEdit";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        {/* Dashboards */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/performance"
          element={
            <PrivateRoute>
              <DashboardPerformance />
            </PrivateRoute>
          }
        />

        {/* Clients */}
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
              <ClientRegister />
            </PrivateRoute>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <PrivateRoute>
              <ClientDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/clients/:id/edit"
          element={
            <PrivateRoute>
              <ClientEdit />
            </PrivateRoute>
          }
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/register"
          element={
            <PrivateRoute>
              <OrderRegister />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <PrivateRoute>
              <OrdersDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/:id/edit"
          element={
            <PrivateRoute>
              <OrderEdit />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
