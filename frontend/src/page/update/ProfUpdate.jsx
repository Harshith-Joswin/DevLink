import React from "react";
import reactLogo from "../../assets/react.svg";
import axios from "axios";
import { useState, useEffect } from "react";
// import FileInput from "./FileInput";
import { useDropzone } from 'react-dropzone';
import { useNavigate } from "react-router-dom";

function ProfUpdate() {
  const navigate = useNavigate();
  const logout =() =>{
    localStorage.removeItem('devlinktoken');
    navigate("/")
  }
  
  const token = localStorage.getItem("devlinktoken");
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    newPassword: "",
    currentPassword: "",
    dateOfBirth: "",
    skills: "",
    occupation: "",
    bio: "",
    profile: "",
  });

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

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [dobData, setdobData] = useState({
    date: "01",
    month: "01",
    year: "2024",
  });

  const newDOB = (dt) => {
    let newDate = dt.substring(0, 10);

    let mon = dt.slice(5, 7);
    let resultStr = "";
    if (mon == "01") {
      resultStr =
      newDate.substring(8, 10) + " January " +  newDate.substring(0, 4);
    } else if (mon == "02") {
      resultStr =
      newDate.substring(8, 10) + " Febraury " +  newDate.substring(0, 4);
    } else if (mon == "03") {
      resultStr =
      newDate.substring(8, 10) + " March " +  newDate.substring(0, 4);
    } else if (mon == "04") {
      resultStr =
      newDate.substring(8, 10) + " April " +  newDate.substring(0, 4);
    } else if (mon == "05") {
      resultStr = 
      newDate.substring(8, 10) + " May " +  newDate.substring(0, 4);
    } else if (mon == "06") {
      resultStr = 
      newDate.substring(8, 10) + " June " +  newDate.substring(0, 4);
    } else if (mon == "07") {
      resultStr = 
      newDate.substring(8, 10) + " July " +  newDate.substring(0, 4);
    } else if (mon == "08") {
      resultStr =
      newDate.substring(8, 10) + " August " +  newDate.substring(0, 4);
    } else if (mon == "09") {
      resultStr =
      newDate.substring(8, 10) + " September " +  newDate.substring(0, 4);
    } else if (mon == "10") {
      resultStr =
      newDate.substring(8, 10) + " October " +  newDate.substring(0, 4);
    } else if (mon == "11") {
      resultStr =
      newDate.substring(8, 10) + " November " +  newDate.substring(0, 4);
    } else if (mon == "12") {
      resultStr =
      newDate.substring(8, 10) + " December " +  newDate.substring(0, 4);
    }

    return resultStr;
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setdobData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("[")) {
      const [field, subField] = name.split("[");
      setFormData((prevState) => ({
        ...prevState,
        [field]: { ...prevState[field], [subField]: value },
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const FileInput = () => {
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: (acceptedFiles) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          profile: acceptedFiles[0],
        }));
      },
    });
  
    return (
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {
          isDragActive ? <p>Drop the file here ...</p> : <p>Drag and drop a file here, or click to select a file</p>
        }
        {
          formData.profile && (
            <p>
              Selected file: {formData.profile.name} ({formData.profile.type})
            </p>
          )
        }
      </div>
    );
  };

  const [successMessage, setSuccessMessage] = useState("");

  const setAlertFalse = () => {
    setTimeout(() => {
      setAlrt("");
    }, 4000);
  };


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
          setFormData((prevFormError) => ({
            ...prevFormError,
            username: res.data.username,
            email: res.data.email,
            firstName: res.data.firstName,
          }));

          if (res.data.lastName != "") {
            setFormData((prevFormError) => ({
              ...prevFormError,
              lastName: res.data.lastName,
            }));
          }

          if (res.data.occupation != "") {
            setFormData((prevFormError) => ({
              ...prevFormError,
              occupation: res.data.occupation,
            }));
          }

          if (res.data.profilePhotoURL != "") {
            setFormData((prevFormError) => ({
              ...prevFormError,
              profilePhotoURL: res.data.profilePhotoURL,
            }));
          }

          if (Array.isArray(res.data.skills) && res.data.skills.length > 0) {
            setFormData((prevFormError) => ({
              ...prevFormError,
              skills: res.data.skills.join(", "),
            }));
          }

          if (res.data.bio != "") {
            setFormData((prevFormError) => ({
              ...prevFormError,
              bio: res.data.bio,
            }));
          }

          if (res.data.dateOfBirth != "") {
            setFormData((prevFormError) => ({
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

  const handleSubmit = async (e) => {

    e.preventDefault();


    const data = new FormData();

    // Append form fields to formData
    if(formData.email)
    data.append('email', formData.email);
    if(formData.username)
      data.append('username', formData.username);
    if(formData.firstName)
      data.append('firstName', formData.firstName);
    if(formData.lastName)
      data.append('lastName', formData.lastName);
    if(formData.skills)
      data.append('skills', formData.skills);
    if(formData.occupation)
      data.append('occupation', formData.occupation);
    if(formData.bio)
      data.append('bio', formData.bio);
    if(formData.date)
      data.append('date', formData.date);
    if(formData.month)
      data.append('month', formData.month);
    if(formData.year)
      data.append('year', formData.year);
    if(formData.currentPassword)
      data.append('currentPassword', formData.currentPassword);
    if(formData.newPassword)
      data.append('newPassword', formData.newPassword);


    if (formData.profile) {
      data.append('profile', formData.profile);
    }

    for (let [key, value] of data.entries()) {
    }
  
      const response = await fetch('http://localhost:4000/api/profile/update', {
        method: "POST",
        headers: {
          'auth_token': `${token}`
      },
      body: data
    });

  if (response.ok) {
    // Handle success (e.g., navigate to another page or show a success message)
    console.log("Profile updated successfully!");
    // navigate('/some-other-page'); // Uncomment and use the correct path to navigate
  } else {
    // Handle error
    console.log("Failed to update profile");
  }


  };


  return (
    <div>
      <>
        <nav
          className="navbar bg-dark bg-body-tertiary p-3"
          data-bs-theme="dark"
        >
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
            <a href="/#" className="btn btn-primary p-sm-2 p-2 mx-sm-2 mx-1 " onClick={logout}>
              Logout
            </a>
          </div>
        </nav>

        <div className="bx-grow container d-flex flex-column align-items-center justify-content-center">
          <h1>Update Profile</h1>
          <div className="container">
          <form  method="POST" onSubmit={handleSubmit} className="form-control p-3 m-2" 
            >
              <label htmlFor="email" className="form-label">
                Enter Email:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="rounded form-control"
                onChange={handleInputChange}
                value={formData.email || ""}
              />
              {/* {formError.email && (
              <p className="text-danger m-0">Invalid email</p>
            )} */}
              <br />

              <label htmlFor="username" className="form-label">
                Enter Username:
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="rounded form-control"
                onChange={handleInputChange}
                value={formData.username || ""}
              />
              {/* {formError.username && (
              <p className="text-danger m-0">
                Username must be at least 5 characters long.
              </p>
            )} */}
              <br />

              <label htmlFor="firstname" className="form-label">
                Enter Firstname:
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="rounded form-control"
                onChange={handleInputChange}
                value={formData.firstName || ""}
              />
              {/* {formError.firstName && (
              <p className="text-danger m-0">
                First name must be at least 3 characters long.
              </p>
            )} */}
              <br />

              <label htmlFor="lastname" className="form-label">
                Enter Last Name:
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                className="rounded form-control"
                onChange={handleInputChange}
                value={formData.lastName || ""}
              />

              <br />

              <label htmlFor="skills" className="form-label">
                Enter Skills(seperate with comma):
              </label>
              <input
                type="text"
                name="skills"
                id="skills"
                className="rounded form-control"
                onChange={handleInputChange}
                value={formData.skills || ""}
              />

              <br />

              <label htmlFor="occupation" className="form-label">
                Enter Occupation:
              </label>
              <input
                type="text"
                name="occupation"
                id="occupation"
                className="rounded form-control"
                onChange={handleInputChange}
                value={formData.occupation || ""}
              />

              <br />

              <label htmlFor="bio" className="form-label">
                Enter Bio:
              </label>
              <textarea
                name="bio"
                id="bio"
                className="rounded form-control"
                rows="3"
                onChange={handleInputChange}
                value={formData.bio || ""}
              ></textarea>
              <br />

              <label htmlFor="dateOfBirth" className="form-label">
                Enter Date of Birth:
              </label>
              <div className="row">
                <div className="col-1">
                  <select
                    name="date"
                    id="date"
                    className="rounded form-control text-center"
                    value={formData.date || ""}
                    onChange={handleDateChange}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((num) => (
                      <option
                        key={num}
                        value={num.toString().padStart(2, "0")}
                        {...(num.toString().padStart(2, "0") === "07"
                          ? { defaultValue: true }
                          : {})}
                      >
                        {num.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-2">
                  <select
                    name="month"
                    id="month"
                    className="rounded form-control text-center"
                    value={formData.month || " "}
                    onChange={handleDateChange}
                  >
                    {monthNames.map((month, index) => (
                      <option
                        key={index}
                        value={(index + 1).toString().padStart(2, "0")}
                        selected={formData.month}
                      >
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-1">
                  <select
                    name="year"
                    id="year"
                    className="rounded form-control text-center"
                    value={formData.year || ""}
                    onChange={handleDateChange}
                  >
                    {Array.from({ length: 104 }, (_, i) => 2024 - i).map(
                      (num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
              {/* {formError.dateOfBirth && (
              <p className="text-danger m-0">Date of Birth required</p>
            )} */}
              <br />

              
              <label htmlFor="profile" className="form-label ">
                Upload Profile
              </label>
              <div className="border border-dark p-2 rounded">
              <FileInput />
              </div>

              <br />

              <label htmlFor="currentPassword" className="form-label">
                Enter Old Password:(Change password if necessary)
              </label>
              <input
                type="password"
                name="currentPassword"
                id="currentPassword"
                className="rounded form-control"
                onChange={(e) => {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    profile: e.target.files[0],
                  }));
                }}
              />
              {/* {formError.password && (
              <ul className="text-danger m-0">
                <li>Password must contain least 8 characters required.</li>
                <li>Password must contain at least one uppercase letter.</li>
                <li>
                  Password must contain contain at least one lowercase letter.
                </li>
                <li>Password must contain contain at least one number.</li>
              </ul>
            )} */}
              <br />

              <label htmlFor="newPassword" className="form-label">
                New Password:
              </label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                className="rounded form-control"
                onChange={handleInputChange}
                value={formData.newPassword}
              />
              {/* {formError.cpass && (
              <p className="text-danger m-0">Password doesn't match.</p>
            )} */}
              <br />

              <div className="container d-flex flex-column justify-content-center align-items-center">
                <input
                  type="submit"
                  value="Update"
                  className="btn btn-primary"
                  style={{ width: "100px" }}
                />
                {/* <p className="text-center">
                  Have an account! <a href="/login">Login Here!</a>
                </p> */}
              </div>
              </form>
          </div>
        </div>
      </>
    </div>
  );
}

export default ProfUpdate;
