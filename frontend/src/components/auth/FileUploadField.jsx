import React, { useRef, useState } from 'react';
import { Upload, FileCheck, X } from 'lucide-react';
import './FileUploadField.css';

export default function FileUploadField({ label, id, onChange, required = false }) {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (onChange) onChange(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onChange) onChange(null);
  };

  return (
    <div className="file-upload-wrapper">
      <div className="file-upload-header">
        <label htmlFor={id} className="file-upload-label">{label}</label>
        <button 
          type="button" 
          className="add-file-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          Add File
        </button>
      </div>

      <div 
        className={`file-dropzone ${fileName ? 'has-file' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          id={id}
          ref={fileInputRef} 
          onChange={handleFileChange}
          style={{ display: 'none' }}
          required={required && !fileName}
        />

        {fileName ? (
          <div className="file-selected-info">
            <FileCheck size={18} className="file-ok-icon" />
            <span className="file-name-text">{fileName}</span>
            <button type="button" className="file-remove-btn" onClick={handleRemove}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="dropzone-placeholder">
            <Upload size={16} className="upload-cloud-icon" />
            <span>Import or Drag File</span>
          </div>
        )}
      </div>
    </div>
  );
}
