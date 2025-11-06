import React, { useState } from 'react';

function FileReaderComponent() {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
    };
    reader.readAsText(file); 
  };

  return (
    <div>
      <h2>File Handling in React</h2>
      <input type="file" onChange={handleFileChange} />
      {fileName && (
        <div>
          <h3>File: {fileName}</h3>
          <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f0f0f0', padding: '10px' }}>
            {fileContent}
          </pre>
        </div>
      )}
    </div>
  );
}

export default FileReaderComponent;
