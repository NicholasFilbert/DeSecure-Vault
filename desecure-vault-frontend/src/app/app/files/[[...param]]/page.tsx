'use client'

import React, { useEffect, useState } from 'react'
import '@/styles/app/files.css'
import Section from '@/components/common/Section'
import Header from '@/components/common/Header'
import Datagrid from '@/components/Datagrid/Datagrid'
import { faDownload, faFile, faFileCirclePlus, faFolder, faFolderPlus, faPencil, faPlus, faShare, faSync, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import FileUploadButton from '@/components/files/UploadButton'
import axiosInstance from '@/utils/axios'
import Dropdown from '@/components/common/Dropdown'
import FormPopup from '@/components/Popup/FormPopup'
import { toast } from 'sonner'
import { notFound } from 'next/navigation'
import { downloadHelper, formatFileSize, typeConverter } from '@/utils/common'
import Button from '@/components/common/Button'
import DialogPopup from '@/components/Popup/DialogPopup'

const Files = ({
  params,
}: {
  params: Promise<{ param: string }>
}) => {
  const [popup, setPopup] = useState<React.ReactNode>()
  const [dirStack, setDirStack] = useState<string[]>([]);
  const [currDir, setCurrDir] = useState('');
  const [parentDir, setParentDir] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const columns: DataGridColumns[] = [
    { key: 'name', label: 'Name', sortable: true, icon: faFile, width: 'max-w-100' },
    // { key: 'owner', label: 'Owner', sortable: false, hide: 'mobile' },
    // { key: 'modified', label: 'Last modified', sortable: true, hide: 'mobile' },
    { key: 'category', label: 'Category', defaultValue: '-', sortable: true, hide: 'mobile' },
    { key: 'size', label: 'File Size', sortable: true, hide: 'mobile' }
  ]

  const detailContent = [
    { label: 'Download', icon: faDownload, type: 'file', action: async (id: string) => await downloadFile(id) },
    { label: 'Rename', icon: faPencil, action: async (id: string, data: any) => await renameFile(id, data) },
    // { label: 'Share', icon: faShare, type: 'file',action: async (id: string) => await shareFile(id) },
    { label: 'Delete', icon: faTrash, action: async (id: string, data: any) => await deleteFile(id, data) },
  ]

  const downloadFile = async (id: string) => {
    try {
      console.log('entered')
      const response = await axiosInstance.post('/files/download', {
        id: id
      }, {
        responseType: 'blob',
        headers: {}
      });

      downloadHelper(response)
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  const renameFile = async (id: string, data: any) => {
    const renameHandler = async (input: Record<string, string>) => {
      try {
        const response = await axiosInstance.post('/files/rename', {
          id: id,
          path: generatePath(),
          prevName: data.name,
          newName: input.name,
          type: typeConverter(data.type)
        })

        toast.success(response.data.message)
        setPopup(null)
        setRefresh(!refresh)
        return true

      } catch (e: any) {
        toast.error(e.response.data.message)
        return false;
      }
    }

    const formFields = [
      {
        label: "New Name",
        defaultValue: data.name,
        name: "name",
        type: "text",
        placeholder: "Enter new name",
        required: true,
      }
    ]

    const renamePopup = (
      <FormPopup
        popupTitle="Rename"
        label='Rename Label'
        size='medium'
        fields={formFields}
        position='center'
        onConfirm={renameHandler}
        onClose={() => { setPopup(null) }}
        confirmText='Confirm'
        cancelText='Cancel'
        showCancelButton={true}
      />
    )

    setPopup(renamePopup)
  }

  const deleteFile = async (id: string, data: any) => {
    const deleteHandler = async () => {
      try {
        const response = await axiosInstance.post('/files/delete', {
          id: id,
          path: generatePath(),
          type: typeConverter(data.type)
        })

        toast.success(response.data.message)
        setPopup(null)
        setRefresh(!refresh)
        return true

      } catch (e: any) {
        toast.error(e.response.data.message)
        return false;
      }
    }

    const deletePopup = (
      <DialogPopup
        icon={faTrash}
        label="Delete Item"
        popupTitle="Confirm Deletion"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteHandler}
        onClose={() => { setPopup(null) }}
        type="error"
      />
    )

    setPopup(deletePopup)
  }

  const shareFile = async (id: string) => {

  }

  const initializeData = async () => {
    try {
      if (isInitialized) {
        return
      }

      setIsLoading(true);
      const { param } = await params;
      if (Array.isArray(param) && param.length > 1) {
        return notFound();
      }

      let path = '';
      if (!!param) {
        path = param[0];
      }

      const response = await axiosInstance.post('/files/get-path-id', {
        path: path
      });

      const dirId = response.data.data;
      const stack = dirId.parentDir.split("/").filter(Boolean);
      const last = stack[stack.length - 1] || "";

      setDirStack(stack);
      setParentDir(last);
      setCurrDir(dirId.currDir);
      return dirId;
    } catch (error) {
      console.error("Failed to initialize data:", error);
      toast.error("Failed to load directory information");
    } finally {
      setIsLoading(false);
      setIsInitialized(true)
    }
  };

  const generatePath = () => {

    let path = '/'
    dirStack.forEach(dir => {
      path += `${dir}/`
    })
    path += currDir
    return path
  }

  const changeDir = (dirId: string, parentDirId: string) => {
    setDirStack((prevStack) => [...prevStack, parentDirId]);
    setCurrDir(dirId);
    setParentDir(parentDirId);

    setRefresh(!refresh)
  }

  const goBack = () => {
    setDirStack((prevStack) => {
      if (prevStack.length === 0) return prevStack;

      const newStack = [...prevStack];
      const lastDir = newStack.pop(); // Get previous directory

      setCurrDir(lastDir || '');
      // Update parentDir correctly (you might need logic based on your structure)
      setParentDir(newStack[newStack.length - 1] || '');

      setRefresh(!refresh);
      return newStack;
    });
  };

  const fetchData = async (page: number, limit: number = 10) => {
    let dirId = {
      parentDir: parentDir,
      currDir: currDir
    }

    if (!isInitialized) {
      dirId = await initializeData()
    }
    let res = []

    if (page === 1 && !!dirId.parentDir) {
      res.push({
        id: '...',
        name: '...',
        size: '',
        type: 'dir',
        updated_at: '',
        user_id: '',
        icon: faFolder,
        onclick: () => goBack()
      })
    }

    let data = await axiosInstance.post('/files/get-item', {
      page,
      limit,
      parentDir: dirId.currDir
    });

    const mappedData = data.data.data.map((item: any) => ({
      ...item,
      name: item.name.length > 64 ? item.name.slice(0, 64) + '...' : item.name,
      size: item.type === 'dir' ? '' : formatFileSize(item.size),
      icon: item.type === 'dir' ? faFolder : faFile,
      onclick: item.type === 'dir' ? () => changeDir(item.id, dirId.currDir) : null
    }));

    res.push(...mappedData)

    return res;
  }

  const uploadFile = async (formData: any) => {
    if (formData.files.length > 5) {
      toast.error("Max file to upload is 5")
      return false
    }

    const form = new FormData()
    form.append('category', formData.category)
    form.append('path', generatePath())
    formData.files.forEach((file: File) => {
      form.append('files', file)
    });

    try {
      let res = await axiosInstance.post('/files/upload-file', form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res => {
        setRefresh(!refresh)
        toast.success(res.data.message)
      })
      return true;

    } catch (e: any) {
      console.log(e)
      toast.error(e.response.data.message)
      return false;
    }
  }

  // Create new directory
  const createDirectory = async (input: Record<string, string>) => {
    try {
      const res = await axiosInstance.post('/files/add-directory', {
        dirName: input.dirName,
        parentDir: currDir
      })

      setRefresh(!refresh)
      toast.success(res.data.message)
      return true
    } catch (e: any) {
      toast.error(e.response.data.message)
      return false
    }
  };

  const formInputs = [
    {
      label: "New Directory Name",
      name: "dirName",
      type: "text",
      placeholder: "Enter directory name",
      required: true,
    }
  ]

  const dropdownItems = [
    {
      id: 'directory',
      type: 'component' as const,
      icon: faFolderPlus,
      label: 'New directory',
      component: (
        <FormPopup
          popupTitle="Create New Directory"
          label='Label'
          children=<span>Add new </span>
          size='medium'
          fields={formInputs}
          position='center'
          onConfirm={createDirectory}
          confirmText='Confirm'
          cancelText='Cancel'
          showCancelButton={true}
        />
      )
    },
    {
      id: 'upload',
      type: 'component' as const,
      icon: faFileCirclePlus,
      label: 'Upload Files',
      component: (
        <FileUploadButton
          icon={faUpload}
          label="Upload Files"
          popupTitle="Upload New Files"
          onConfirm={uploadFile}
          confirmText="Upload"
          size='large'
        />
      )
    },
  ];

  // function previewFile() {
  //   const fileInput = document.getElementById('fileInput');
  //   const file = fileInput.files[0];
  //   const previewContainer = document.getElementById('previewContainer');

  //   previewContainer.innerHTML = ''; // Clear previous preview

  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = function(e) {
  //       const url = e.target.result;

  //       if (file.type.startsWith('image/')) {
  //         const img = document.createElement('img');
  //         img.src = url;
  //         img.style.maxWidth = '300px';
  //         previewContainer.appendChild(img);

  //       } else if (file.type === 'application/pdf') {
  //         const iframe = document.createElement('iframe');
  //         iframe.src = url;
  //         iframe.style.width = '100%';
  //         iframe.style.height = '500px';
  //         previewContainer.appendChild(iframe);

  //       } else if (file.type.startsWith('text/')) {
  //         const text = document.createElement('pre');
  //         text.textContent = url;
  //         reader.onload = function(e) {
  //           text.textContent = e.target.result;
  //         };
  //         reader.readAsText(file); // For text, we read as text instead of DataURL
  //         previewContainer.appendChild(text);

  //       } else if (file.type.startsWith('video/')) {
  //         const video = document.createElement('video');
  //         video.src = url;
  //         video.controls = true;
  //         video.style.maxWidth = '300px';
  //         previewContainer.appendChild(video);

  //       } else {
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.textContent = 'Download ' + file.name;
  //         link.download = file.name;
  //         previewContainer.appendChild(link);
  //       }
  //     };

  //     // Choose how to read the file
  //     if (file.type.startsWith('text/')) {
  //       reader.readAsText(file);
  //     } else {
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }


  const actionButton = (
    <>
      <Button
        icon={faSync}
        tooltip='Refresh'
        action={() => setRefresh(!refresh)}
      />
      <Dropdown
        buttonText="Add Items"
        buttonIcon={faPlus}
        items={dropdownItems}
        position="right"
      />
    </>
  );
  return (
    <>
      {popup}
      <Header title="My Files" />
      <Section title='Files' action={actionButton} className='h-[80vh]'>
        <Datagrid columns={columns} detailContent={detailContent} fetchData={fetchData} hasDetail={true} className='h-[calc(100%-40px)]' refresh={refresh} />
      </Section>
    </>
  )
}

export default Files
