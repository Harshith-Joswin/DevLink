import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

import Home from "./page/home/Home.jsx";
import Login from "./page/login/Login.jsx";
import Register from "./page/register/Register.jsx";
import NotFound from "./page/notfound/NotFound.jsx";
import UserProfile from "./page/user_profile/UserProfile.jsx";
import Profile from "./page/profile/Profile.jsx";
import ProfUpdate from "./page/update/ProfUpdate.jsx";
import { Route, Routes } from "react-router-dom";
import UnderDevelopment from "./page/underDevelopment/UnderDevelopment.jsx";
import Feed from "./page/feed/Feed.jsx";
import AcceptedProjects from "./page/acceptedPosts/AcceptedProjects.jsx";
import MyPosts from "./page/myPosts/MyPosts.jsx";
import CreatePost from "./page/createPost/CreatePost.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./PrivateRoute";
import AutoLogin from "./AutoLogin.jsx";

import Navbar from "./page/nav/Navbar.jsx";
import { useState,useEffect } from "react";
import Notifications from "./page/notification/Notification.jsx";

function App() {

  const [newNote, setNewNote] = useState();

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<AutoLogin />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<PrivateRoute />}>


          <Route path="/feed" element={<><Navbar /><Feed /></>} />
          <Route path="/profile" element={<><Navbar /><UserProfile /></>} />
          <Route path="/profile/:slug" element={<><Navbar /><Profile /></>} />
          <Route path="/profupdate" element={<><Navbar /><ProfUpdate /></>} />
          <Route path="/myposts" element={<>  <Navbar /> <MyPosts /></>} />
          <Route path="/projectAccepted" element={<><Navbar /><AcceptedProjects /></>} />
          <Route path="/message" element={<><Navbar /><UnderDevelopment /></>} />
          <Route path="/create-post" element={<><Navbar /><CreatePost /></>} />
          <Route path="/notifications" element={<><Navbar /><Notifications/></>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
