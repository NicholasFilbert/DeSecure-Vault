'use client'

import React from 'react'
import * as snarkjs from 'snarkjs'
import Section from '@/components/common/Section'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faUpRightFromSquare, faUpload, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import Datagrid from '@/components/Datagrid/Datagrid'
import { useState, useRef, useCallback } from 'react';
import { formatFileSize } from '@/utils/common'
import axiosInstance from '@/utils/axios'

const App = () => {
  const columns: DataGridColumns[] = [
    { key: 'id', label: 'No', sortable: true },
    { key: 'filename', label: 'File Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'dirname', label: 'Directory Name', sortable: true },
  ]

  const fetchData = async (page: number, limit: number = 10) => {
    const res = data.map((d, i) => ({
      ...d,
      id: i + 1,
      category: !!d.category ? d.category : '-',
      onclick: () => {window.location.replace(`/app/files/${d.path}`)} 
    }));
    return res
  }

  // ===  Handle Upload File  === 

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'uploading', 'processing', 'complete'
  const [refresh, setRefresh] = useState(true)
  const [data, setData] = useState([]);
  const fileInputRef = useRef(null);


  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // simulateUpload();
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      await simulateUpload();
    }
  };

  // Get file type icon or preview
  const getFilePreview = () => {
    if (!file) return null;

    if (file.type.startsWith('image/')) {
      return (
        <div className="w-10 h-10 rounded overflow-hidden">
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    const fileType = file.name.split('.').pop().toUpperCase();
    return (
      <div className="w-10 h-10 flex items-center justify-center bg-primary rounded text-white text-xs font-bold">
        {fileType}
      </div>
    );
  };

  // Simulate file upload
  const simulateUpload = useCallback(async () => {
    if (!file) {
      console.error('No file selected');
      setUploadStatus('Error');
      return;
    }

    setUploadStatus('Loading');

    try {
      // 1. Load WASM file using proper initialization
      const wasmResponse = await fetch('/zksnark/circuit/FileUploader_js/FileUploader.wasm');
      if (!wasmResponse.ok) throw new Error('Failed to load WASM file');
      const wasmBuffer = await wasmResponse.arrayBuffer();

      // 2. Load zKey file
      const zkeyResponse = await fetch('/zksnark/circuit/filehash_final.zkey');
      if (!zkeyResponse.ok) throw new Error('Failed to load zKey file');
      const zkeyBuffer = await zkeyResponse.arrayBuffer();

      setUploadStatus('Processing');

      // 3. Calculate file hash
      const fileBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));

      const bitArray = [];
      hashArray.forEach(byte => {
        // Convert each byte to 8 bits (MSB first)
        for (let i = 7; i >= 0; i--) {
          bitArray.push((byte >> i) & 1);
        }
      });

      // 4. Prepare input matching circuit's in[256]
      const input = {
        in: bitArray // Array of 256 numbers (0 or 1)
      };

      setUploadStatus('Generating');

      // 4. Initialize snarkjs with proper WASM setup
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        {
          type: 'mem',
          data: new Uint8Array(wasmBuffer)
        },
        new Uint8Array(zkeyBuffer)
      );
      
      setUploadStatus('Verifying');

      // 5. Send to backend
      const response = await axiosInstance.post('/files/verify-proof', {
        proof,
        publicSignals
      });

      setData(response.data)
      setUploadStatus('complete')
      setRefresh(!refresh)

      // setUploadStatus('Verification successful!');
      // return response.data;

    } catch (error) {
      console.error('Error in proof generation:', error);
      setUploadStatus(`Error: ${error.message}`);
      throw error;
    }
  }, [file]);

  // Handle upload button click
  const handleUpload = async () => {
    if (file && uploadStatus !== 'uploading') {
      await simulateUpload();
    }
  };

  // Handle remove file
  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle browse click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Header title="Utils" />
      <Section title="Search File" className='mb-8'>
        <div className="max-w-md w-full mx-auto p-4">
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 bg-bg-card hover:bg-bg-hover ${isDragging ? 'border-primary bg-opacity-20' : 'border-border-color'}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
              />

              <FontAwesomeIcon icon={faUpload} size={48} className="text-primary mb-4" />
              <h3 className="text-xl font-medium mb-2">Drag & Drop file here</h3>
              <p className="text-sm text-text-muted mb-4">or click to browse files</p>

              <button
                className="bg-primary hover:bg-primary-dark cursor-pointer text-white py-2 px-4 rounded-md flex items-center transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
              >
                Select File
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-bg-card rounded-lg border border-border-color">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFilePreview()}
                    <div>
                      <div className="font-medium text-text-light">{file.name}</div>
                      <div className="text-sm text-text-muted">{formatFileSize(file.size)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {uploadStatus === 'complete' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success text-success-text">
                        <FontAwesomeIcon icon={faCheck} size={12} className="mr-1" />
                        Complete
                      </span>
                    )}

                    {!!uploadStatus && (uploadStatus !== 'uploading' && uploadStatus !== 'complete') && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning text-white">
                        {uploadStatus}
                      </span>
                    )}

                    {uploadStatus === 'uploading' && (
                      <div className="w-24">
                        <div className="bg-bg-hover h-1 rounded-full w-full overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all duration-200 ease-in-out"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-xs mt-1 text-text-muted">{uploadProgress}%</div>
                      </div>
                    )}

                    <button
                      className="p-1.5 rounded-md cursor-pointer hover:bg-bg-hover transition-colors duration-200"
                      onClick={handleRemoveFile}
                    >
                      <FontAwesomeIcon icon={faXmark} size={16} className="text-text-muted hover:text-danger" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 cursor-pointer border border-border-color rounded-md text-text-light hover:bg-bg-hover transition-colors duration-200"
                  onClick={handleRemoveFile}
                >
                  Cancel
                </button>

                <button
                  className={`px-4 py-2 rounded-md flex items-center transition-colors duration-200 ${uploadStatus === 'complete'
                    ? 'bg-success hover:bg-success-dark text-white cursor-pointer'
                    : 'bg-primary hover:bg-primary-dark text-white cursor-pointer'
                    }`}
                  onClick={handleUpload}
                // disabled={uploadStatus !== 'complete' && uploadStatus !== ''}
                >
                  {uploadStatus === 'complete' ? 'Searched' : 'Search'}
                  {uploadStatus !== 'complete' && <FontAwesomeIcon icon={faUpload} size={16} className="ml-2" />}
                </button>
              </div>
            </div>
          )}
        </div>

        <Datagrid columns={columns} hasDetail={false} fetchData={fetchData} refresh={refresh}/>
      </Section>

      <Footer />
    </>
  )
}

export default App