import React from "react";
import reactLogo from "../../assets/react.svg";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import './createPost.css'

function CreatePost() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: 0,
    platforms: [],
    technologies: [],
  });

  const [biddingEndDate, setBiddingEndDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [minProjectEndDate, setMinProjectEndDate] = useState("");

  const [formError, setformError] = useState({
    title: false,
    description: false,
    budget: false,
    biddingEndDate: false,
    projectEndDate: false,
    platforms: false,
    technologies: false,
  });

  const tomorrow = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

  const handleBiddingEndDateChange = (e) => {
    const selectedDate = e.target.value;
    setBiddingEndDate(selectedDate);
    const minDate = new Date(selectedDate);
    minDate.setDate(minDate.getDate() + 1);
    setMinProjectEndDate(minDate.toISOString().split("T")[0]);
  };

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

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

  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

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

  const handleFileChange = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handlePDFFile(chosenFiles);
  };

  const handlePDFFile = (files) => {
    const uploaded = [...uploadedFiles];
    files.some((file) => {
      uploaded.push(file);
    });
    setFiles(uploaded);
  };

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
          console.log("success:", res);
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
          console.log("Failed:", e.response);
          console.log(JSON.stringify(obj, null, 2));
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
          <a href="/register" className="btn btn-primary p-sm-2 p-2 mx-sm-2 mx-1 ">
            Register
          </a>
        </div> 
      </nav> */}

      <div className="bx-grow container d-flex flex-column align-items-center justify-content-center">
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
            {/* <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={handleFileSelect}
            />
            <div>
              {selectedFiles.map((file, index) => (
                <div key={index}>
                  <Document file={file}>
                    <Page pageNumber={1} />
                  </Document>
                </div>
              ))}
            </div> */}
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
