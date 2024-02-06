import "./App.css";
import { Route, Routes } from "react-router-dom";

import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Profile from "./components/user/Profile";
import IsPrivate from "./components/controllers/Private";
import Layout from "./components/layout/Layout";
import Home from "./components/Home";
import Voice from "./components/Voice";
import Drive from "./components/drive/Drive";
import DriveImages from "./components/drive/Images/Images";

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
          path="/voice"
          element={
            <IsPrivate>
              <Layout>
                <Voice />
              </Layout>
            </IsPrivate>
          }
        />
        <Route
          path="/drive"
          element={
            <Layout>
              <Drive />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }/>
        <Route
          path="/tools"
          element={
            <Layout>
              <Home />
            </Layout>
          }/>
        <Route
          path="/drive/images"
          element={
            <Layout>
              <DriveImages />
            </Layout>
          }/>
        <Route
          path="/drive/calendar"
          element={
            <Layout>
              <DriveImages />
            </Layout>
          }/>
        <Route
          path="/drive/diary"
          element={
            <Layout>
              <DriveImages />
            </Layout>
          }/>

        <Route path="*" element={<h2>404 Page Not Found</h2>} />
      </Routes>
    </div>
  );
}

export default App;
