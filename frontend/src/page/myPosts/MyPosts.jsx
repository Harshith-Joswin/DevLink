import React, { useEffect, useState } from "react";
import "./MyPosts.css";
import "../nav/Navbar.css";
import "../posts/post.css";
import Navbar from "../nav/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import defaultAvatar from '../profile/profile.jpg';

import Posts from "../posts/Posts";

export default function MyPosts() {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        occupation: "",
        profilePhotoURL: "",
        skills: [],
        bio: "",
        dateOfBirth: "",
        profile: "",
      });
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:4000/api/post/myposts", {
                    method: "POST",
                    headers: {
                        "auth_token": localStorage.getItem('devlinktoken'),
                    }
                });
                const json = await response.json();
                const posts = json.posts;

                // Set posts
                setPosts(posts);

                // Fetch user profiles
                const users1Promises = posts.map(async (post) => {
                    const userResponse = await fetch(`http://localhost:4000/api/profile/` + post.user, {
                        method: "POST",
                        headers: {
                          "auth_token": localStorage.getItem('devlinktoken'),
                      }
                    });
                    return await userResponse.json();
                });

                // Wait for all user profile fetch promises to resolve
                const users1 = await Promise.all(users1Promises);

                // Set users
                setUsers(users1);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();

    }, []); // Empty dependency array means this effect will only run once, after the initial render


    useEffect(() => {
        axios
          .post(
            "http://localhost:4000/api/profile",
            {},
            {
              headers: {
                auth_token: localStorage.getItem("devlinktoken"),
              },
            }
          )
          .then((res) => {
            if (res.status === 200) {
              setData((prevFormError) => ({
                ...prevFormError,
                username: res.data.username,
                email: res.data.email,
                firstName: res.data.firstName,
              }));
    
              if (res.data.lastName != "") {
                setData((prevFormError) => ({
                  ...prevFormError,
                  lastName: res.data.lastName,
                }));
              }
    
              if (res.data.occupation != "") {
                setData((prevFormError) => ({
                  ...prevFormError,
                  occupation: res.data.occupation,
                }));
              }
    
              if (res.data.profilePhotoURL != "") {
                setData((prevFormError) => ({
                  ...prevFormError,
                  profilePhotoURL: res.data.profilePhotoURL,
                }));
              }
    
              if (Array.isArray(res.data.skills) && res.data.skills.length > 0) {
                setData((prevFormError) => ({
                  ...prevFormError,
                  skills: res.data.skills.join(", "),
                }));
              }
    
              if (res.data.bio != "") {
                setData((prevFormError) => ({
                  ...prevFormError,
                  bio: res.data.bio,
                }));
              }
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

    if (loading) {
        return (
          <main id="main" style={{display:"flex", justifyContent:"center", height:"100vh", color:"gray"}}>
                Loading..
            </main>
        )
    }
    else if(posts.length==0){
      return (
        <main id="main" style={{display:"flex", justifyContent:"center", height:"100vh", color:"gray"}}>
        <h3>You have not posted anything yet... :(</h3>
    </main>
      )
    }
    else
    return (
            <main id="main">
                <div className="create_post" onClick={()=>{navigate("/create-post")}}>
                    <img src={data.profilePhotoURL ? 'http://localhost:4000/api/profile/photo/'+data.profilePhotoURL : defaultAvatar} alt="profile" className="profile" />
                    <div id="create_post">Post a new project...</div>
                </div>
                {
                    posts.map((post, index) => (
                        <Posts key={post.id} MyPosts={true} post={post} user={data} />
                    ))
                }
            </main>
    );
};

