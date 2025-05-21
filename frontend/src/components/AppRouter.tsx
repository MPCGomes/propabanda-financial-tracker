import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard/Evolution";
import DashboardPerformance from "../pages/Dashboard/Performance";
import Clients from "../pages/Client/ViewAll";
import Client from "../pages/Client/View";
import ClientRegister from "../pages/Client/Register";
import ClientEdit from "../pages/Client/Edit";
import Orders from "../pages/Order/ViewAll";
import Order from "../pages/Order/View";
import OrderRegister from "../pages/Order/Register";
import PrivateRoute from "./PrivateRoute";
import OrderEdit from "../pages/Order/Edit";

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
              <Client />
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
              <Order />
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
