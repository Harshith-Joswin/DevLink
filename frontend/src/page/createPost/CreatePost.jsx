import React from "react";
import { useState } from "react";
import { toast } from 'react-toastify';

import { useNavigate } from "react-router-dom";
import axios from "axios";


function CreatePost() {
  const navigate = useNavigate();

  const navigate = useNavigate();

  // Store form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: 0,
    platforms: [],
    technologies: [],
  });


  // Store bidding end date and project end date
  const [biddingEndDate, setBiddingEndDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [minProjectEndDate, setMinProjectEndDate] = useState("");

  // Data to store if there are any errors in the form
  const [formError, setformError] = useState({
    title: false,
    description: false,
    budget: false,
    biddingEndDate: false,
    projectEndDate: false,
    platforms: false,
    technologies: false,
  });

  // Code the return tomorrows date
  const tomorrow = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

   // If the user inputs or changes the bidding date value in the form
  const handleBiddingEndDateChange = (e) => {
    const selectedDate = e.target.value;
    setBiddingEndDate(selectedDate);
    const minDate = new Date(selectedDate);
    minDate.setDate(minDate.getDate() + 1);
    setMinProjectEndDate(minDate.toISOString().split("T")[0]);
  };

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

   // If the user inputs or changes data in the form for form submission
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

  // If the user selects images in the form
  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  // If the user uploads images in the form
  const handleUploadFiles = (files) => {
    const uploaded = [...uploadedFiles];
    files.some((file) => {
      uploaded.push(file);
    });
    setUploadedFiles(uploaded);

    const preview = [...previewImages];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        preview.push(reader.result);
        setPreviewImages(preview);
      };
      reader.readAsDataURL(file);
    });
  };

  const [files, setFiles] = useState([]);

  // If the user selects pdf in the form
  const handleFileChange = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handlePDFFile(chosenFiles);
  };

  // If the user selects images in the form
  const handlePDFFile = (files) => {
    const uploaded = [...uploadedFiles];
    files.some((file) => {
      uploaded.push(file);
    });
    setFiles(uploaded);
  };
  

  // Form submission code
  const handleSubmit = (e) => {
    e.preventDefault();

    const formValue = new FormData();


    if (
      formData.title &&
      formData.description &&
      biddingEndDate &&
      projectEndDate &&
      formData.platforms.length > 0 &&
      formData.technologies.length > 0 &&
      formData.budget
    ) {
      formValue.append("title", formData.title);
      formValue.append("description", formData.description);
      formValue.append("biddingEndDate", biddingEndDate);
      formValue.append("projectEndDate", projectEndDate);

      let platString = formData.platforms;
      let platSubString = platString.split(",");
      let platformArray = platSubString.map((substring) => substring.trim());
      platformArray.forEach((element) => {
        formValue.append("platforms", element);
      });

      let techString = formData.technologies;
      let techSubStrings = techString.split(",");
      let technologyArray = techSubStrings.map((str) => str.trim());
      technologyArray.forEach((element) => {
        formValue.append("technologies", element);
      });

      uploadedFiles.forEach((file) => {
        formValue.append("images", file);
      });
      files.forEach((file) => {
        formValue.append("documents", file);
      });

      formValue.append("budget", formData.budget);

      const token = localStorage.getItem("devlinktoken");

      axios
        .post("http://localhost:4000/api/post/create", formValue, {
          headers: {
            auth_token: `${token}`,
          },
        })
        .then((res) => {
          toast.success("Post Uploaded Successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          navigate("/myposts");
        })
        .catch((e) => {
          let obj = e.response.data;
        });
    } else {
      setformError((prevFormError) => ({
        ...prevFormError,
        title: false,
      }));
      setformError((prevFormError) => ({
        ...prevFormError,
        description: false,
      }));
      setformError((prevFormError) => ({
        ...prevFormError,
        biddingEndDate: false,
      }));

      setformError((prevFormError) => ({
        ...prevFormError,
        projectEndDate: false,
      }));
      setformError((prevFormError) => ({
        ...prevFormError,
        platforms: false,
      }));
      setformError((prevFormError) => ({
        ...prevFormError,
        technologies: false,
      }));
      setformError((prevFormError) => ({
        ...prevFormError,
        budget: false,
      }));
    

      if(!(formData.title &&
        formData.description &&
        biddingEndDate &&
        projectEndDate &&
        formData.platforms.length > 0 &&
        formData.technologies.length > 0 &&
        formData.budget)){
          toast.error("Fill out the required fields", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }

    

    if (!formData.title || formData.title.length < 3) {
      setformError((prevFormError) => ({
        ...prevFormError,
        title: true,
      }));
    }

      if (!formData.description || formData.description.length < 5) {
        setformError((prevFormError) => ({
          ...prevFormError,
          description: true,
        }));
      }

      if (!biddingEndDate) {
        setformError((prevFormError) => ({
          ...prevFormError,
          biddingEndDate: true,
        }));
      }

      if (!projectEndDate) {
        setformError((prevFormError) => ({
          ...prevFormError,
          projectEndDate: true,
        }));
      }

      if (!formData.platforms.length > 0) {
        setformError((prevFormError) => ({
          ...prevFormError,
          platforms: true,
        }));
      }

      if (!formData.technologies.length > 0) {
        setformError((prevFormError) => ({
          ...prevFormError,
          technologies: true,
        }));
      }

      if (!formData.budget) {
        setformError((prevFormError) => ({
          ...prevFormError,
          budget: true,
        }));
      }
    }
  };

  return (
    <>
      <div id="main" className="bx-grow container d-flex flex-column align-items-center justify-content-center">

        <h1>Create Post</h1>
        <div className="container">
          <form
            className="form-control p-3 m-2"
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <label htmlFor="title" className="form-label">
              <span className="req-field">* </span>
              Enter Title:
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="rounded form-control"
              onChange={handleInputChange}
            />
            {formError.title && (
              <p className="text-danger m-0">at least 3 characters required</p>
            )}
            <br />

            <label htmlFor="description" className="form-label">
              <span className="req-field">* </span>
              Enter Description:
            </label>
            <textarea
              name="description"
              id="description"
              className="rounded form-control"
              rows="3"
              onChange={handleInputChange}
            ></textarea>

            {formError.description && (
              <p className="text-danger m-0">at least 5 characters required</p>
            )}
            <br />

            <label htmlFor="budget" className="form-label">
              <span className="req-field">* </span>
              Enter Budget(in ₹):
            </label>
            <input
              type="number"
              name="budget"
              id="budget"
              onChange={handleInputChange}
              className="rounded form-control"
            />
            {formError.budget && (
              <p className="text-danger m-0">Budget value required</p>
            )}
            <br />

            <label htmlFor="biddingEndDate" className="form-label">
              <span className="req-field">* </span>
              Enter Bidding End Date(minimum date tomorrow):
            </label>
            <input
              type="date"
              name="biddingEndDate"
              id="biddingEndDate"
              pattern="yyyy-mm-dd"
              className="rounded form-control"
              min={tomorrow()}
              value={biddingEndDate}
              onChange={handleBiddingEndDateChange}
            />
            {formError.biddingEndDate && (
              <p className="text-danger m-0">Bidding date required</p>
            )}
            <br />

            <label htmlFor="projectEndDate" className="form-label">
              <span className="req-field">* </span>
              Enter Project End Date(minimum date one day ahead of bidding end
              date):
            </label>

            <input
              type="date"
              name="projectEndDate"
              id="projectEndDate"
              pattern="yyyy-mm-dd"
              className="rounded form-control"
              min={minProjectEndDate}
              value={projectEndDate}
              onChange={(e) => setProjectEndDate(e.target.value)}
            />
            {formError.projectEndDate && (
              <p className="text-danger m-0">Project End Date required</p>
            )}
            <br />

            <label htmlFor="platforms" className="form-label">
              <span className="req-field">* </span>
              Enter Platforms to develop the project: <br />
              (seperate platforms with commas):
            </label>
            <input
              type="text"
              name="platforms"
              id="platforms"
              className="rounded form-control"
              placeholder="Ex: Andriod, Web, Windows"
              onChange={handleInputChange}
            />
            {formError.platforms && (
              <p className="text-danger m-0">Platforms required</p>
            )}
            <br />

            <label htmlFor="technologies" className="form-label">
              <span className="req-field">* </span>
              Enter technologies to develop the project: <br />
              (seperate technologies with commas):
            </label>
            <input
              type="text"
              name="technologies"
              id="technologies"
              className="rounded form-control"
              placeholder="Ex: PHP, MERN, etc"
              onChange={handleInputChange}
            />
            {formError.technologies && (
              <p className="text-danger m-0">Technologies required</p>
            )}
            <br />

            <div>
              <label htmlFor="images" className="form-label">
                Select the images to post:
              </label>
              <br />
              <input
                type="file"
                name="images"
                multiple
                onChange={handleFileEvent}
                accept="image/*"
              />
              <ul
                style={{
                  listStyleType: "none",
                  display: "flex",
                  flexDirection: "row",
                  overflow: "auto",
                  margin: "10px",
                }}
              >
                {previewImages.map((image, index) => (
                  <li key={index} style={{ margin: "5px" }}>
                    <img src={image} alt={image} style={{ height: "300px" }} />
                  </li>
                ))}
              </ul>
            </div>
            <br />

            <label htmlFor="documents" className="form-label">
              Select the pdf files to post:
            </label>
            <br />
            <input
              type="file"
              name="documents"
              multiple
              onChange={handleFileChange}
              accept="application/pdf"
            />
            <br />
            <br />
            <div className="container d-flex flex-column justify-content-center align-items-center">
              <button className="btn btn-primary center">Create Post</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
