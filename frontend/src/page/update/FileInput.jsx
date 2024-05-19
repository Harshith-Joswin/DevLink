import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileInput = () => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFormData((prevFormData) => ({ ...prevFormData, profile: acceptedFiles[0] }));
    },
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      {
        isDragActive ? <p>Drop the file here ...</p> : <p>Drag and drop a file here, or click to select a file</p>
      }
    </div>
  );
};

export default FileInput;