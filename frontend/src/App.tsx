import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import Login from "./pages/Login";

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
      </Routes>
    </Router>
  );
}

export default App;
