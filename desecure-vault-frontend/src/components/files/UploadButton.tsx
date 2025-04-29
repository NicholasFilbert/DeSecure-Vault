'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, ReactNode, useRef, ChangeEvent } from 'react'
import Popup from '../Popup/Popup';
import { faXmark, faExclamationTriangle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { formatFileSize } from '@/utils/common';

interface UploadPopupButtonProps {
  buttonComponent?: React.ReactNode;
  icon?: IconDefinition;
  label?: string;
  popupTitle?: string;
  size?: 'small' | 'medium' | 'large';
  position?: 'center' | 'top';
  action?: (...args: any[]) => unknown;
  onConfirm?: (formData: any) => boolean | Promise<boolean>;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
}

const FileUploadButton: React.FC<UploadPopupButtonProps> = ({
  buttonComponent = null,
  icon,
  label = 'Upload Files',
  popupTitle = 'Upload New Files',
  size = 'large',
  position = 'center',
  action,
  onConfirm,
  confirmText = 'Upload',
  cancelText = 'Cancel',
  showCancelButton = true
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
    if (action) {
      action();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFiles([]);
    setCategory('');
    setError(null);
  };

  const checkDuplicateFiles = (newFiles: File[]): { hasDuplicates: boolean, duplicateNames: string[] } => {
    // Get all file names (existing + new)
    const allFileNames = new Map<string, number>();
    const duplicateNames: string[] = [];

    // Check existing files
    files.forEach(file => {
      allFileNames.set(file.name, (allFileNames.get(file.name) || 0) + 1);
    });

    // Check new files
    newFiles.forEach(file => {
      allFileNames.set(file.name, (allFileNames.get(file.name) || 0) + 1);
    });

    // Find duplicates
    allFileNames.forEach((count, name) => {
      if (count > 1) {
        duplicateNames.push(name);
      }
    });

    return {
      hasDuplicates: duplicateNames.length > 0,
      duplicateNames
    };
  };

  const handleConfirm = async () => {
    // Check if no files were uploaded
    if (files.length === 0) {
      setError("Please select at least one file to upload");
      return;
    }

    // Check for duplicates one more time before submission
    const { hasDuplicates, duplicateNames } = checkDuplicateFiles([]);

    if (hasDuplicates) {
      const duplicateList = duplicateNames.join(', ');
      setError(`Found duplicate file names: ${duplicateList}`);
      return;
    }

    let confirm = true

    if (onConfirm) {
      const formData = {
        files,
        category
      };
      confirm = await onConfirm(formData);
    }
    
    if (confirm){
      setIsOpen(false);
      resetForm()
    }
  };

  const addFiles = (newFiles: File[]) => {
    const { hasDuplicates, duplicateNames } = checkDuplicateFiles(newFiles);

    if (hasDuplicates) {
      const duplicateList = duplicateNames.join(', ');
      setError(`Found duplicate file names: ${duplicateList}`);

      // Only add files that don't have duplicate names
      const existingNames = new Set(files.map(f => f.name));
      const uniqueNewFiles = newFiles.filter(file => !existingNames.has(file.name));

      if (uniqueNewFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...uniqueNewFiles]);
      }
    } else {
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setError(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      addFiles(fileArray);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files);
      addFiles(fileArray);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.filter((_, i) => i !== index);

      // Check if removing this file resolves the duplicate error
      const { hasDuplicates } = checkDuplicateFiles([]);
      if (!hasDuplicates) {
        setError(null);
      }

      return newFiles;
    });
  };


  return (
    <>
      {/* {buttonComponent ? (
        buttonComponent
      ) : (
      <button className="btn btn-primary" onClick={handleOpen}>
        {icon && <FontAwesomeIcon icon={icon} />}
        <span>{label}</span>
      </button>
      )} */}

      <Popup
        isOpen={isOpen}
        onClose={handleClose}
        title={popupTitle}
        size={size}
        position={position}
      >
        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                className="w-full bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-md p-2 text-[var(--text-light)]"
                placeholder="Enter Category (Optional)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-danger/30 border border-danger text-danger-text p-3 rounded-md flex items-start gap-2">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mt-1 text-danger-text" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Files <span className='text-danger'>*</span></label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragActive ? 'border-[var(--primary)] bg-[var(--bg-hover)]' : 'border-[var(--border-color)]'
                  } ${error ? 'border-danger-dark' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={openFileDialog}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  {icon && <FontAwesomeIcon icon={icon} className="text-3xl text-[var(--text-muted)]" />}
                  <p className="text-sm text-[var(--text-muted)]">
                    <span className="font-medium text-[var(--primary)]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Any file format is supported
                  </p>
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Selected Files ({files.length})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-[var(--bg-dark)] p-2 rounded-md">
                      <div className="flex items-center space-x-2 truncate">
                        {icon && <FontAwesomeIcon icon={icon} className="text-[var(--text-muted)]" />}
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="text-[var(--text-muted)] hover:text-[var(--text-light)] cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            {showCancelButton && (
              <button onClick={handleClose} className="btn btn-outline">
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className="btn btn-primary"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </Popup>
    </>
  )
}

export default FileUploadButton;