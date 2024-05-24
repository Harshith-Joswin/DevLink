// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

import Home from "./page/home/Home.jsx";
import Login from "./page/login/Login.jsx";
import Register from "./page/register/Register.jsx";
import ProjectFeed from "./page/projectfeed/ProjectFeed.jsx";
import NotFound from "./page/notfound/NotFound.jsx";
import Messages from "./page/messages/Messages.jsx";
import UserProfile from "./page/user_profile/UserProfile.jsx";
import Profile from "./page/profile/Profile.jsx";
import ProfUpdate from "./page/update/ProfUpdate.jsx";
import { Route, Routes } from "react-router-dom";
import UnderDevelopment from "./page/underDevelopment/UnderDevelopment.jsx";
import Feed from "./page/feed/Feed.jsx";
import MyPosts from "./page/myPosts/MyPosts.jsx";
import CreatePost from "./page/createPost/CreatePost.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./PrivateRoute";
import AutoLogin from "./AutoLogin.jsx";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <ToastContainer />
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/feed" element={<Feed />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/:slug" element={<Profile />} />
        <Route path="/profupdate" element={<ProfUpdate />} />
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="/projectAccepted" element={<UnderDevelopment />} />
        <Route path="/message" element={<UnderDevelopment />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/mes" element={<Messages/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes> */}

      <Routes>
        <Route element={<AutoLogin />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile/:slug" element={<Profile />} />
          <Route path="/profupdate" element={<ProfUpdate />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/projectAccepted" element={<UnderDevelopment />} />
          <Route path="/message" element={<UnderDevelopment />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
