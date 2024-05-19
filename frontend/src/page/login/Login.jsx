import React from "react";
import reactLogo from "../../assets/react.svg";
import Alert from "../components/Alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [dataError, setdataError] = useState(false);
  const [formData, setformData] = useState({
    username: "",
    password: "",
  })
  const navigate = useNavigate();

  const handleInputChange = (e) =>{
    const { name, value } = e.target;
    if (name.includes("[")) {
      const [field, subField] = name.split("[");
      setformData((prevState) => ({
        ...prevState,
        [field]: { ...prevState[field], [subField]: value },
      }));
    } else {
      setformData((prevState) => ({ ...prevState, [name]: value }));
    }
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log({
      username:formData.username,
      password:formData.password
    })
    axios.post("http://localhost:4000/api/auth/login",{
      username:formData.username,
      password:formData.password
    }).then((response)=>{
      if (response.status === 200) {
      const token = response.data;
      localStorage.setItem('devlinktoken', token.auth_token);
      navigate("/feed");
      }
    }).catch((error)=>{
      setdataError(true);
      setTimeout(() => {
        setdataError(false);
      }, 4000);
    })
  }

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
          <a href="/register" className="btn btn-primary p-sm-2 p-2 mx-sm-2 mx-1 ">
            Register
          </a>
        </div>
      </nav>

      {/* Alerts */}
      {dataError && <Alert alert="Invalid user name or password."/>}

      <div className="bx-grow container d-flex flex-column align-items-center justify-content-center">
        <h1>Login</h1>
        <div className="container">
          <form className="form-control p-3 m-2" onSubmit={handleSubmit}>
            <label htmlFor="username" className="form-label">
              Enter Username:
            </label>
            <input
              type="text"
              name="username"
              id="em-us"
              className="rounded form-control"
              onChange={handleInputChange}
              value={formData.username}
            />
            <br />

            <label htmlFor="password" className="form-label">
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
            <br />

            <div className="container d-flex flex-column justify-content-center align-items-center">
              <input
                type="submit"
                value="Login"
                className="btn btn-primary"
                style={{ width: "100px" }}
              />
              <p className="text-center">
                Don't have an account!{" "}
                <a href="register">Click here to create an account</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
