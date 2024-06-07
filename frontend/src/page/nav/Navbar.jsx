import React from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/react.svg";
import { toast } from 'react-toastify';

export default function Navbar() {
  const currentUrl = window.location.href;

  const navigate = useNavigate();
  const logout =() =>{
    
    toast.error('Logged out from Devlink', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    localStorage.removeItem('devlinktoken');
    navigate("/")
  }

  return (
    <>
      <div id="sideBar">
        <header className="header">
          <img src={defaultAvatar} alt="Logo" />
          <h1>DevLink</h1>
        </header>
        <nav className="nav">
          <div
            className={
              currentUrl == "http://localhost:5173/feed" ? "tab active" : "tab"
            }
            onClick={() => {
              navigate("/feed");
            }}
          >
            Projects
          </div>
          {/* <div className="tab" >IdeaExchange</div> */}
          <div
            className={
              currentUrl == "http://localhost:5173/myposts" || currentUrl == "http://localhost:5173/create-post"
                ? "tab active"
                : "tab"
            }
            onClick={() => {
              navigate("/myposts");
            }}
          >
            My Posts
          </div>
          <div
            className={
              currentUrl == "http://localhost:5173/projectAccepted"
                ? "tab active"
                : "tab"
            }
            onClick={() => {
              navigate("/projectAccepted");
            }}
          >
            Projects Accepted
          </div>
          <div
            className={
              currentUrl == "http://localhost:5173/message"
                ? "tab active"
                : "tab"
            }
            onClick={() => {
              navigate("/message");
            }}
          >
            Message
          </div>
          <div
            className={
              currentUrl == "http://localhost:5173/profile" || currentUrl == "http://localhost:5173/profupdate" || currentUrl.startsWith("http://localhost:5173/profile/")
                ? "tab active"
                : "tab"
            }
            onClick={() => {
              navigate("/profile");
            }}
          >
            Profile
          </div>
          <div
            className={
              currentUrl == "http://localhost:5173/notifications"
                ? "tab active"
                : "tab"
            }
            onClick={() => {
              navigate("/notifications");
            }}
          >
            Notifications
          </div>
        </nav>
        <div id="logout" onClick={logout}>Logout</div>
      </div>
    </>
  );
}
