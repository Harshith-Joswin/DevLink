import React from "react";
import reactLogo from "../../assets/react.svg";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";

function CreatePost() {
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

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: 0,
    biddingEndDate: "2024-01-01",
    projectEndDate: "2024-01-01",
    platforms: [],
    technologies: [],
  });

  const [biddingEndDate, setbiddingEndDate] = useState({
    date: "01",
    month: "01",
    year: "2024",
  });

  const [projectEndDate, setprojectEndDate] = useState({
    date: "01",
    month: "01",
    year: "2024",
  });

  const handleBidDateChange = (e) => {
    const { name, value } = e.target;
    setbiddingEndDate((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProjDateChange = (e) => {
    const { name, value } = e.target;
    setprojectEndDate((prevData) => ({ ...prevData, [name]: value }));
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

  // const handleUpload = () => {
  //   const formData = new FormData();
  //   uploadedFiles.forEach((file) => {
  //     formData.append("files", file);
  //   });
  // };

  // const [status, setStatus] = useState("initial");

  const handleFileChange = (e) => {
    // setFiles(e.target.files);
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

    if (formData.title)
      formValue.append('title', formData.title);
    if (formData.description)
      formValue.append('description', formData.description);
    if (formData.biddingEndDate)
      formValue.append('biddingEndDate', biddingEndDate.year + '-' + biddingEndDate.month + '-' + biddingEndDate.date);
    if (formData.projectEndDate)
      formValue.append('projectEndDate', projectEndDate.year + '-' + projectEndDate.month + '-' + projectEndDate.date);
    if (formData.platforms)
      formValue.append('platforms', formData.platforms);
    if (formData.technologies)
      formValue.append('technologies', formData.technologies);
    // if(uploadedFiles)
    //     formValue.append('images', [uploadedFiles]);
    // if(files)
    //     formValue.append('documents', [files]);
    uploadedFiles.forEach((file) => {
      formValue.append('images', file);
    });
    files.forEach((file) => {
      formValue.append('documents', file);
    });
    if (formData.budget)
      formValue.append('budget', formData.budget)
    // console.log(files[0]);

    // const form2val = {
    //   title: formData.title,
    //   description: formData.description,
    //   platforms: [formData.platforms],
    //   technologies: [formData.technologies],
    //   budget: formData.budget,
    //   biddingEndDate: biddingEndDate.year + "-" + biddingEndDate.month + "-" + biddingEndDate.date,
    //   projectEndDate: projectEndDate.year + "-" + projectEndDate.month + "-" + projectEndDate.date,
    //   images: [uploadedFiles][0],
    //   documents: [files]
    // };
    // console.log(form2val)

    const token = localStorage.getItem("devlinktoken");

    axios
      .post(
        "http://localhost:4000/api/post/create",
        formValue,
        {
          headers: {
            auth_token: `${token}`,
          },
        }
      )
      .then((res) => {
        console.log("success:", res);
      })
      .catch((e) => {
        console.log("Failed:", e.response);
      });
  };

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
        {/* <div className="navbar-item">
          <a href="/register" className="btn btn-primary p-sm-2 p-2 mx-sm-2 mx-1 ">
            Register
          </a>
        </div> */}
      </nav>

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
              Enter Title:
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="rounded form-control"
              onChange={handleInputChange}
            />
            <br />

            <label htmlFor="description" className="form-label">
              Enter Description:
            </label>
            <textarea
              name="description"
              id="description"
              className="rounded form-control"
              rows="3"
              onChange={handleInputChange}
            ></textarea>
            <br />

            <label htmlFor="budget" className="form-label">
              Enter Budget(in $):
            </label>
            <input
              type="number"
              name="budget"
              id="budget"
              onChange={handleInputChange}
              className="rounded form-control"
            />
            <br />

            <label htmlFor="biddingEndDate" className="form-label">
              Enter Bidding End Date:
            </label>
            <div className="row">
              <div className="col-1">
                {/* <label className="form-label">Date:</label> */}
                <select
                  name="date"
                  id="date"
                  className="rounded form-control text-center"
                  onChange={handleBidDateChange}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num.toString().padStart(2, "0")}>
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
                  onChange={handleBidDateChange}
                >
                  {monthNames.map((month, index) => (
                    <option
                      key={index}
                      value={(index + 1).toString().padStart(2, "0")}
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
                  onChange={handleBidDateChange}
                >
                  {Array.from({ length: 50 }, (_, i) => 2024 + i).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <br />

            <label htmlFor="projectEndDate" className="form-label">
              Enter Project End Date:
            </label>
            <div className="row">
              <div className="col-1">
                {/* <label className="form-label">Date:</label> */}
                <select
                  name="date"
                  id="date"
                  className="rounded form-control text-center"
                  onChange={handleProjDateChange}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num.toString().padStart(2, "0")}>
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
                  onChange={handleProjDateChange}
                >
                  {monthNames.map((month, index) => (
                    <option
                      key={index}
                      value={(index + 1).toString().padStart(2, "0")}
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
                  onChange={handleProjDateChange}
                >
                  {Array.from({ length: 50 }, (_, i) => 2024 + i).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <br />

            <label htmlFor="platforms" className="form-label">
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
            <br />

            <label htmlFor="technologies" className="form-label">
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
