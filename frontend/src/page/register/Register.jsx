import React from "react";
import reactLogo from "../../assets/react.svg";
import "./register.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { toast } from 'react-toastify';

function Register() {
  const navigate = useNavigate();

  // // Store form data
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: null,
  });

  // Store data of birth data
  const [dobData, setdobData] = useState(new Date());

  // Data to store if there are any errors in the form
  const [formError, setformError] = useState({
    firstName: false,
    username: false,
    email: false,
    dateOfBirth: false,
    password: false,
    cpass: false,
  });

  // Data to store Alert message
  const [alrt, setAlrt] = useState(null);

  // If the user inputs or changes the date of birth value in the form
  const handleDateChange = (e) => {
    setdobData(e.target.value)
  };

  // If the user inputs or changes the data in the form for form submission
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


  const setAlertFalse = () => {
    setTimeout(() => {
      setAlrt("");
    }, 4000);
  };

  // Form submission code
  const handleSubmit = (e) => {
    e.preventDefault();


    // Check if passwords match
    if (formData.password === formData.confirmPassword) {
      axios
        .post("http://localhost:4000/api/auth/signup", {
          username: formData.username,
          firstName: formData.firstName,
          email: formData.email,
          password: formData.password,
          dateOfBirth: dobData,
        })
        .then((response) => {
          if (response.status === 201) {
            setformError((prevFormError) => ({
              ...prevFormError,
              username: false,
            }));
            setformError((prevFormError) => ({
              ...prevFormError,
              firstName: false,
            }));
            setformError((prevFormError) => ({
              ...prevFormError,
              email: false,
            }));
            setformError((prevFormError) => ({
              ...prevFormError,
              dateOfBirth: false,
            }));
            setformError((prevFormError) => ({
              ...prevFormError,
              password: false,
            }));
            setformError((prevFormError) => ({
              ...prevFormError,
              cpass: false,
            }));


            const token = response.data;
            localStorage.setItem("devlinktoken", token.auth_token);
            

            toast.success("Registration Successful", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            navigate("/feed");
          }
        })
        .catch((errorObject) => {
          let obj = errorObject.response.data;
          setformError((prevFormError) => ({
            ...prevFormError,
            username: false,
          }));
          setformError((prevFormError) => ({
            ...prevFormError,
            firstName: false,
          }));
          setformError((prevFormError) => ({
            ...prevFormError,
            email: false,
          }));
          setformError((prevFormError) => ({
            ...prevFormError,
            dateOfBirth: false,
          }));
          setformError((prevFormError) => ({
            ...prevFormError,
            password: false,
          }));
          setformError((prevFormError) => ({
            ...prevFormError,
            cpass: false,
          }));

          obj.errors.forEach((error) => {

            if (error.path == "username") {
              if (error.message == "duplicate") {
                setAlrt("Username already exists");
                setAlertFalse();
              } else {
                setformError((prevFormError) => ({
                  ...prevFormError,
                  username: true,
                }));
              }
            } else if (error.path == "firstName") {
              setformError((prevFormError) => ({
                ...prevFormError,
                firstName: true,
              }));
            } else if (error.path == "email") {
              if (error.message == "duplicate") {
                setAlrt("Email already registered");
                setAlertFalse();
              } else {
                setformError((prevFormError) => ({
                  ...prevFormError,
                  email: true,
                }));
              }
            } else if (error.path == "dateOfBirth") {
              setformError((prevFormError) => ({
                ...prevFormError,
                dateOfBirth: true,
              }));
            } else if (error.path == "password") {
              setformError((prevFormError) => ({
                ...prevFormError,
                password: true,
              }));
            }
          });
        });
    } else {
      setformError((prevFormError) => ({
        ...prevFormError,
        cpass: true,
      }));
    }
  };

  return (
    <>
    {/* Navbar */}
      <nav className="navbar bg-dark bg-body-tertiary p-3" data-bs-theme="dark">
        <div className="navbar-brand ms-sm-3 ms-1">
          <img
            src={reactLogo}
            alt="Bootstrap"
            height="40"
          />
          <a href="/" className="text-reset text-decoration-none mx-2">
            DevLink
          </a>
        </div>
        <div className="navbar-item">
          <a href="/login" className="btn btn-primary p-sm-2 p-2 mx-sm-2 mx-1 ">
            Login
          </a>
        </div>
      </nav>

      {/* Alert message for form error */}
      {alrt && <Alert alert={alrt} />}

      {/* Form Code */}
      <div className="bx-grow container d-flex flex-column align-items-center justify-content-center">
        <h1>Register</h1>
        <div className="container">
          <form
            className="form-control p-3 m-2"
            method="post"
            onSubmit={handleSubmit}
          >
            <label htmlFor="email" className="form-label">
            <span className="req-field">* </span>
              Enter Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="rounded form-control"
              onChange={handleInputChange}
              value={formData.email}
            />
            {formError.email && (
              <p className="text-danger m-0">Invalid email</p>
            )}
            <br />

            <label htmlFor="username" className="form-label">
            <span className="req-field">* </span>
              Enter Username:
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="rounded form-control"
              onChange={handleInputChange}
              value={formData.username}
            />
            {formError.username && (
              <p className="text-danger m-0">
                Username must be at least 5 characters long.
              </p>
            )}
            <br />

            <label htmlFor="firstname" className="form-label">
            <span className="req-field">* </span>
              Enter Firstname:
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="rounded form-control"
              onChange={handleInputChange}
              value={formData.firstName}
            />
            {formError.firstName && (
              <p className="text-danger m-0">
                First name must be at least 3 characters long.
              </p>
            )}
            <br />

            <label htmlFor="dateOfBirth" className="form-label">
            <span className="req-field">* </span>
              Enter Date of Birth:
            </label>

            <input type="date" name="da" id="da" pattern="yyyy-mm-dd" className="rounded form-control" onChange={handleDateChange}/>
            <br />

            <label htmlFor="password" className="form-label">
            <span className="req-field">* </span>
              Enter Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="rounded form-control"
              onChange={handleInputChange}
              value={formData.password}
            />
            {formError.password && (
              <ul className="text-danger m-0">
                <li>Password must contain least 8 characters required.</li>
                <li>Password must contain at least one uppercase letter.</li>
                <li>
                  Password must contain contain at least one lowercase letter.
                </li>
                <li>Password must contain contain at least one number.</li>
              </ul>
            )}
            <br />

            <label htmlFor="confirmPassword" className="form-label">
            <span className="req-field">* </span>
              Confirm Password:
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="rounded form-control"
              onChange={handleInputChange}
              value={formData.confirmPassword}
            />
            {formError.cpass && (
              <p className="text-danger m-0">Password doesn't match.</p>
            )}
            <br />

            <div className="container d-flex flex-column justify-content-center align-items-center">
              <input
                type="submit"
                value="Register"
                className="btn btn-primary"
                style={{ width: "100px" }}
              />
              <p className="text-center">
                Have an account! <a href="/login">Login Here!</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
