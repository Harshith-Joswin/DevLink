import React from "react";
import "./Navbar.css";
import {useNavigate} from 'react-router-dom'
import defaultAvatar from '../../assets/react.svg'


export default function Navbar() {

    const currentUrl = window.location.href;
    
const navigate = useNavigate();

return (
    <>
        <div id="sideBar">
            <header className="header">
                <img src={defaultAvatar} alt="Logo" />
                <h1>DevLink</h1>
            </header>
            <nav className='nav'>
                <div className={currentUrl=="http://localhost:5173/feed"?"tab active":"tab"} onClick={()=>{navigate('/feed')}}>Projects</div>
                {/* <div className="tab" >IdeaExchange</div> */}
                <div className={currentUrl=="http://localhost:5173/myposts"?"tab active":"tab"} onClick={()=>{navigate('/myposts')}}>My Posts</div>
                <div className= {currentUrl=="http://localhost:5173/projectAccepted"?"tab active":"tab"} onClick={()=>{navigate('/projectAccepted')}}>Projects Accepted</div>
                <div className= {currentUrl=="http://localhost:5173/message"?"tab active":"tab"} onClick={()=>{navigate('/message')}}>Message</div>
                <div className={currentUrl=="http://localhost:5173/profile"?"tab active":"tab"}  onClick={()=>{navigate('/profile')}}>Profile</div>
            </nav>
            <div id="logout">Logout</div>
        </div>
    </>
);
};