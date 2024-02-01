import "./App.css";
import { Route, Routes } from "react-router-dom";

import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Profile from "./components/user/Profile";
import IsPrivate from "./components/controllers/Private";
import Layout from "./components/layout/Layout";
import Home from "./components/Home";

import LoggedIn from "./components/controllers/LoggedIn";

import Chat from "./components/chat/Chat";


function App() {
  return (
    <div>
      <Routes>

        <Route
          path="/signup"
          element={
            <Layout>
              <Signup />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <LoggedIn>
            <Layout>
              <Login />
            </Layout>
            </LoggedIn>
          }
        />
        <Route
          path="/profile"
          element={
            <IsPrivate>
              <Layout>
                <Profile />
              </Layout>
            </IsPrivate>
          }
        />
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }

        <Route path="*" element={<h2>404 Page Not Found</h2>} />
      </Routes>
    </div>
  );
}

export default App;
