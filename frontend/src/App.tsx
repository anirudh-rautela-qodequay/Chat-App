import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider, theme, App as AntApp } from "antd";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1677ff",
        },
      }}
    >
      <AntApp>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Register />} />
            </Routes>
          </Layout>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
