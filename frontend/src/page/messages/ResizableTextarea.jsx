import React, { useEffect, useRef } from 'react';

const ResizableTextarea = ({ value, onChange, rows, maxRows }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    // Check if the number of rows exceeds the maximum allowed
    if (textarea.value.split("\n").length > maxRows) {
      textarea.value = textarea.value.substring(0, textarea.value.lastIndexOf("\n"));
    }

    // Update the font size based on the number of rows
    const fontSize = rows > 5? '1.5em' : '1em';
    textarea.style.fontSize = fontSize;
  }, [value, rows, maxRows]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      rows={rows}
      className="form-control" id="textAreaExample2"
    />
  );
};

export default ResizableTextarea;