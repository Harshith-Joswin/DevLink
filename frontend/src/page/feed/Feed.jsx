import React, { useEffect, useState } from "react";
import "./Feed.css";
import Navbar from "../nav/Navbar";

import Posts from "../posts/Posts";
import { useNavigate } from "react-router-dom";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("http://localhost:4000/api/post?page=1&limit=10", {
                    method: "POST",
                    headers: {
                        "auth_token": localStorage.getItem('devlinktoken')
                    }
                });

                const json = await response.json();
                const posts = json.posts;

                // Set posts
                setPosts(posts);

                // Fetch user profiles
                const users1Promises = posts.map(async (post) => {
                    const userResponse = await fetch(`http://localhost:4000/api/profile/` + post.user, {
                        method: "POST"
                    });
                    return await userResponse.json();
                });

                // Wait for all user profile fetch promises to resolve
                const users1 = await Promise.all(users1Promises);

                // Set users
                setUsers(users1);

                setLoading(false);
            } catch (error) {
                localStorage.removeItem('devlinktoken');
                console.error("Error fetching data:", error);
            }
        }
        fetchData();

    }, []); // Empty dependency array means this effect will only run once, after the initial render

    if (loading) {
        return 
        (
            <>
            <Navbar />
            <main id="main">
                Loading..
            </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main id="main">
                <div className="create_post" onClick={()=>{navigate("/create-post")}}>
                    <img src="{{user.profile_photo.url}}" alt="profile" className="profile" />
                    <div id="create_post">Post a new project...</div>
                </div>
                {
                    posts.map((post, index) => (
                        <Posts key={post.id} post={post} user={users[index]} />
                    ))
                }
            </main>
        </>
    );
};

