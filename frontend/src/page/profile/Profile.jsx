import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

// Importing the images
import reactLogo from "../../assets/react.svg";
import profileImage from "./profile.jpg";

function Profile() {
  const token = localStorage.getItem("devlinktoken");
  let navigate = useNavigate();
  const logout =() =>{
    localStorage.removeItem('devlinktoken');
    navigate("/")
  }
  const { slug } = useParams();

  const [data, setData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    occupation: "",
    profilePhotoURL: "",
    skills: [],
    bio: "",
  });


  //http://localhost:4000/api/profile/66480c30922b2ee16da8116b

  //http://localhost:4000/api/profile:66480c30922b2ee16da8116b
  useEffect(() => {
    axios
      .post(
        `http://localhost:4000/api/profile/${slug}`,
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

          console.log(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.post(
  //         "http://localhost:4000/api/profile/66480c30922b2ee16da8116b",
  //         {},
  //         {
  //           headers: {
  //             auth_token: `${token}`,
  //           },
  //         }
  //       );

  //       if (response.status === 200) {
  //         const {
  //           username,
  //           email,
  //           firstName,
  //           lastName,
  //           occupation,
  //           profilePhotoURL,
  //           skills,
  //           bio,
  //           dateOfBirth,
  //         } = response.data;

  //         setData({
  //           username,
  //           email,
  //           firstName,
  //           lastName,
  //           occupation,
  //           profilePhotoURL,
  //           skills,
  //           bio,
  //           dateOfBirth: dateOfBirth ? newDOB(dateOfBirth) : "",
  //         });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [token]);

  return (
    <>
    <nav className="navbar bg-dark bg-body-tertiary p-3" data-bs-theme="dark">
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
        </a>
        {/* <a href="#" className="btn btn-primary p-sm-2 p-2 mx-sm-2 mx-1 ">Profile</a> */}
      </div>
    </nav>

    <div className=" d-flex justify-content-center p-2 bg-dark text-white main">
      <div style={{ width: "50%" }}>
        {/* <div className="container"> */}
        <div className="row my-5">
          <div className="col-6">
            <img
              src={profileImage}
              alt="Bootstrap"
              // width="40"
              height="200"
              className="profile-photo"
            />
          </div>
          <div className="col">
            <div className="d-flex flex-row ">
              <strong className="my-2 fs-3">{data.username}</strong>

              <a
                className="btn btn-primary mx-5 my-2 p-1"
                href="#"
              >
                Follow
              </a>
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
    {/* </div> */}
  </>
      );
    }


export default Profile;