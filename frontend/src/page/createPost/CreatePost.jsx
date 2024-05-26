import React from "react";
import reactLogo from "../../assets/react.svg";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
// import { Document, Page } from "react-pdf";

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

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

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

  const handleUpload = () => {
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });

    // Use Axios to upload the files
    // axios.post('/upload', formData)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };

  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("initial");

  const handleFileChange = (e) => {
    setFiles(e.target.files);
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
          <form className="form-control p-3 m-2" method="post">
            <label htmlFor="title" className="form-label">
              Enter Title:
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="rounded form-control"
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
            ></textarea>
            <br />

            <label htmlFor="budget" className="form-label">
              Enter Budget(in $):
            </label>
            <input
              type="number"
              name="budget"
              id="budget"
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
                  name="date-bidEnd"
                  id="date"
                  className="rounded form-control text-center"
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
                  name="month-bidEnd"
                  id="month"
                  className="rounded form-control text-center"
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
                  name="year-bidEnd"
                  id="year"
                  className="rounded form-control text-center"
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
                  name="date-projEnd"
                  id="date"
                  className="rounded form-control text-center"
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
                  name="month-projEnd"
                  id="month"
                  className="rounded form-control text-center"
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
                  name="year-projEnd"
                  id="year"
                  className="rounded form-control text-center"
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
            />
            <br />

            <div>
              <label htmlFor="images" className="form-label">
                Select the images to post:
              </label><br />
              <input type="file" multiple onChange={handleFileEvent} accept="image/*" />
              <ul style={{listStyleType:'none', display:'flex', flexDirection:'row', overflow:'auto', margin:'10px'}}>
                {previewImages.map((image, index) => (
                  <li key={index} style={{margin:'5px'}}>
                    <img src={image} alt={image} style={{ height: "300px" }} />
                  </li>
                ))}
              </ul>
            </div>
            <br />

            <label htmlFor="images" className="form-label">
              Select the pdf files to post:
            </label><br />
            <input type="file" multiple onChange={handleFileChange} accept="application/pdf"/>
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
            <div class="container d-flex flex-column justify-content-center align-items-center">
            <button className="btn btn-primary center">Create Post</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
