import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../nav/Navbar";
import Post from "../posts/Posts";

// Importing the images
import reactLogo from "../../assets/react.svg";
import profileImage from "./profile.jpg";

function Profile() {
  // Retrieve authentication token
  const token = localStorage.getItem("devlinktoken");

  const { slug } = useParams();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    occupation: "",
    profilePhotoURL: "",
    skills: [],
    bio: "",
    isFollowing: false,
  });

  // Function to load profile of a user from backend API
  async function fetchData() {
    await axios
      .post(
        `http://localhost:4000/api/profile/${slug}`,
        {},
        {
          headers: {
            auth_token: `${token}`,
          },
        }
      )
      .then(async (res) => {
        if (res.status === 200) {
          setData((prevFormError) => ({
            ...prevFormError,
            id: res.data.id,
            username: res.data.username,
            firstName: res.data.firstName,
          }));

          if (res.data.lastName != "") {
            setData((prevFormError) => ({
              ...prevFormError,
              lastName: res.data.lastName,
            }));
          }

          if (res.data.isFollowing) {
            setData((prevFormError) => ({
              ...prevFormError,
              isFollowing: true,
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
              profilePhotoURL: 'http://localhost:4000/api/profile/photo/' + res.data.profilePhotoURL,
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
        else {
          console.log(res);
        }


        try {
          const response = await fetch("http://localhost:4000/api/profile/posts/" + res.data.id + "?page=1&limit=10", {
            method: "POST",
            headers: {
              "auth_token": localStorage.getItem('devlinktoken')
            }
          });


          const json = await response.json();
          const posts = json.posts;

          // Set posts
          setPosts(posts);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }


      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);


  const handleFollow = async () => {
    try {
      let res;
      if(data.isFollowing)
      res = await fetch("http://localhost:4000/api/profile/" + data.id + "/unfollow", {
        method: "POST",
        headers: {
          "auth_token": localStorage.getItem('devlinktoken')
        }
      });
      else
      res = await fetch("http://localhost:4000/api/profile/" + data.id + "/follow", {
        method: "POST",
        headers: {
          "auth_token": localStorage.getItem('devlinktoken')
        }
      });

      if (res.status == 200) {
        if(data.isFollowing){
            setData((prevFormError) => ({
              ...prevFormError,
              isFollowing: false,
            }))         
        }
        else{
          setData((prevFormError) => ({
            ...prevFormError,
            isFollowing: true,
          })) 
        }
      }
    }
    catch (e) {

    }
  }


  if (loading) {
    return (
        <main id="main">
          Loading..
        </main>
    );
  }

  return (
      <main id="main">
        <div className=" d-flex justify-content-center p-2 bg-light text-black main">
          <div style={{ width: "80%" }}>
            <div className="row my-5">
              <div className="col-6">
                <img
                  src={data.profilePhotoURL ? data.profilePhotoURL : profileImage}
                  alt="profile"
                  width="200"
                  height="200"
                  className="profile-photo"
                  style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                />
              </div>
              <div className="col">
                <div className="d-flex flex-row ">
                  <strong className="my-2 fs-2">{data.firstName} {data.lastName}</strong>
                  <button
                    className={data.isFollowing ? "btn btn-secondary mx-5 my-2" : "btn btn-primary mx-5 my-2"} style={{ width: '100px', height: '40px' }}
                    onClick={handleFollow}
                  >
                    {data.isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                </div>

                <div className="row">
                  <span className="fs-5 p-1 m-2">
                    {data.username}
                  </span>
                </div>

                <div className="details d-flex flex-row p-1 row">
                  {data.bio && (
                    <span className="fs-5 my-1">
                      Bio:
                      <span className="fs-6">{data.bio}</span>
                    </span>
                  )}

                  {data.skills != "" && (
                    <span className="fs-5 my-1">
                      Skills:
                      <span className="fs-6"> {data.skills} </span>
                    </span>
                  )}

                  {data.occupation && (
                    <span className="fs-5 my-1">
                      Occupation:{" "}
                      <span className="fs-6"> {data.occupation} </span>
                    </span>
                  )}


                </div>
              </div>
            </div>
          </div>
        </div>

        {posts.map((post, index) => (
          <Post key={post.id} post={post} user={data} />
        ))}

      </main>
  );
}


export default Profile;