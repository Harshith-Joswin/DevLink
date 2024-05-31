import React from "react";
import reactLogo from "../../assets/react.svg";
import profileImage from "./profile.jpg";
import "./userProfile.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../nav/Navbar";

function UserProfile() {
  const token = localStorage.getItem("devlinktoken");

  let navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("devlinktoken");
    navigate("/");
  };

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

  const newDOB = (dt) => {
    let newDate = dt.substring(0, 10);

    let mon = dt.slice(5, 7);
    let resultStr = "";
    if (mon == "01") {
      resultStr =
        newDate.substring(8, 10) + " January " + newDate.substring(0, 4);
    } else if (mon == "02") {
      resultStr =
        newDate.substring(8, 10) + " Febraury " + newDate.substring(0, 4);
    } else if (mon == "03") {
      resultStr =
        newDate.substring(8, 10) + " March " + newDate.substring(0, 4);
    } else if (mon == "04") {
      resultStr =
        newDate.substring(8, 10) + " April " + newDate.substring(0, 4);
    } else if (mon == "05") {
      resultStr = newDate.substring(8, 10) + " May " + newDate.substring(0, 4);
    } else if (mon == "06") {
      resultStr = newDate.substring(8, 10) + " June " + newDate.substring(0, 4);
    } else if (mon == "07") {
      resultStr = newDate.substring(8, 10) + " July " + newDate.substring(0, 4);
    } else if (mon == "08") {
      resultStr =
        newDate.substring(8, 10) + " August " + newDate.substring(0, 4);
    } else if (mon == "09") {
      resultStr =
        newDate.substring(8, 10) + " September " + newDate.substring(0, 4);
    } else if (mon == "10") {
      resultStr =
        newDate.substring(8, 10) + " October " + newDate.substring(0, 4);
    } else if (mon == "11") {
      resultStr =
        newDate.substring(8, 10) + " November " + newDate.substring(0, 4);
    } else if (mon == "12") {
      resultStr =
        newDate.substring(8, 10) + " December " + newDate.substring(0, 4);
    }

    return resultStr;
  };

  // const post = ()=>{
  useEffect(() => {
    axios
      .post(
        "http://localhost:4000/api/profile",
        {},
        {
          headers: {
            auth_token: `${token}`,
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
              profilePhotoURL: 'http://localhost:4000/api/profile/photo/'+res.data.profilePhotoURL,
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

          if (res.data.dateOfBirth != "") {
            setData((prevFormError) => ({
              ...prevFormError,
              dateOfBirth: newDOB(res.data.dateOfBirth),
            }));
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


  return (
    <>
      {/* <nav className="navbar bg-dark bg-body-tertiary p-3" data-bs-theme="dark">
        <div className="navbar-brand ms-sm-3 ms-1">
          <img
            src={reactLogo}
            alt="Bootstrap"
            // width="40"
            height="40"
          />
          <a href="/" className="text-reset text-decoration-none mx-2">
            DevLink
          </a>
        </div>
        <div className="navbar-item">
          <a
            href="#"
            className="btn btn-primary p-sm-2 p-2 mx-sm-2 mx-1 "
            onClick={logout}
          >
            Logout
        </div>
      </nav> */}

      <Navbar></Navbar>
      <main id="main">
      <div className=" d-flex justify-content-center p-2 bg-ligth text-black main">
        <div style={{ width: "50%" }}>
          {/* <div className="container"> */}
          <div className="row my-5">
            <div className="col-6">
              <img
                src={data.profilePhotoURL?data.profilePhotoURL:profileImage}
                alt="profile"
                // width="40"
                height="200"
                className="profile-photo"
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
            </div>
            <div className="col">
              <div className="d-flex flex-row ">
                <strong className="my-2 fs-3">{data.username}</strong>

                <div
                  className="btn btn-primary mx-5 my-2 p-1"
                  onClick={()=>{navigate('/profupdate')}} style={{width:'100px'}}
                >
                  Edit
                </div>
              </div>

              <div className="row">
                <span className="fs-5 p-1 m-2">
                  {data.firstName} {data.lastName}
                </span>
              </div>

              {/* <div className="d-flex flex-row p-1 col">
                <span className="fs-5 my-2">5 posts</span>
                <span className="fs-5 my-2 ms-3">5 followers</span>
                <span className="fs-5 my-2 ms-3">5 following</span>
              </div> */}

              <div className="details d-flex flex-row p-1 row">
                {data.bio && (
                  <span className="fs-5 my-1">
                    Bio:
                    <span className="fs-6">{data.bio}</span>
                  </span>
                )}

                {data.email && (
                  <span className="fs-5 my-1">
                    Email: <span className="fs-6"> {data.email} </span>
                  </span>
                )}

                {data.dateOfBirth && (
                  <span className="fs-5 my-1">
                    Date of Birth:
                    <span className="fs-6"> {data.dateOfBirth} </span>
                  </span>
                )}

                {data.skills && data.skills.length > 0 && (
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
      </div></main>
      {/* </div> */}
    </>
  );
}

export default UserProfile;
